// controllers/reportController.js
const Order = require('../models/orderModel');
const mongoose = require('mongoose');
// Import necessary date-fns helpers
const { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } = require('date-fns');

// Report 1: Get Revenue by a specified period
exports.getRevenueByPeriod = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query; // Get dates from query params

        // --- Date Processing ---
        let matchStage = { status: 'completed' }; // Always filter for completed orders
        let groupByFormat = "%Y-%m"; // Default grouping by Month/Year
        let projectFormat = { $concat: ["Tháng ", { $toString: "$_id.month" }, "/", { $toString: "$_id.year" }] };

        if (startDate && endDate) {
            // Use specified date range
            const start = startOfDay(new Date(startDate));
            const end = endOfDay(new Date(endDate));

            matchStage.createdAt = { $gte: start, $lte: end };

            // Calculate day difference
            const diffDays = (end - start) / (1000 * 60 * 60 * 24);
            if (diffDays <= 31) {
                // If 31 days or less, group by day
                groupByFormat = "%Y-%m-%d";
                projectFormat = {
                    $dateToString: {
                        format: "%d/%m/%Y",
                        date: { $dateFromParts: { 'year': "$_id.year", 'month': "$_id.month", 'day': "$_id.day" } }
                    }
                };
            }
        } else {
            // Default: Get stats for the last 365 days if no range is provided
            const oneYearAgo = subDays(new Date(), 365);
            matchStage.createdAt = { $gte: oneYearAgo };
        }
        // -------------------------

        const stats = await Order.aggregate([
            {
                $match: matchStage // Apply date filter
            },
            {
                // Group by the determined format (day or month)
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        // Only add 'day' to grouping if format is by day
                        ...(groupByFormat === "%Y-%m-%d" && { day: { $dayOfMonth: '$createdAt' } })
                    },
                    totalRevenue: { $sum: '$totalPrice' },
                    count: { $sum: 1 } // Count number of orders
                }
            },
            {
                // Sort chronologically for the chart
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            },
            {
                $project: { // Format the output
                    _id: 0, // Remove default _id
                    period: projectFormat, // Apply display format (e.g., "Tháng 10/2025" or "25/10/2025")
                    revenue: "$totalRevenue",
                    ordersCount: "$count"
                }
            }
        ]);

        res.status(200).json({ status: 'success', data: { stats } });
    } catch (error) {
        console.error("Error fetching revenue report:", error);
        next(error);
    }
};

// Report 2: Get Top 5 Best Selling Products for a specific month
exports.getBestSellingProducts = async (req, res, next) => {
    try {
        // Get year/month from query params, default to current year/month
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || (new Date().getMonth() + 1); // JS month is 0-11, so +1

        // Create a date object for the first day of the selected month
        const date = new Date(year, month - 1, 1); // JS month constructor is 0-11, so -1

        // Get the start and end of that month
        const startDate = startOfMonth(date);
        const endDate = endOfMonth(date);

        // Match stage for aggregation
        let matchStage = {
            status: 'completed',
            createdAt: { $gte: startDate, $lte: endDate } // Filter by the selected month
        };

        const stats = await Order.aggregate([
            { $match: matchStage }, // Apply the month filter
            { $unwind: '$items' }, // Deconstruct the items array
            {
                // Group by product ID
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: 1 }, // Count each item (key) sold
                    totalRevenueGenerated: { $sum: '$items.priceAtPurchase' }
                }
            },
            {
                // Sort by quantity sold descending
                $sort: { totalQuantitySold: -1 }
            },
            {
                // Get only the top 5
                $limit: 5
            },
            {
                // Look up product details from the 'products' collection
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                // $lookup returns an array, unwind it
                $unwind: '$productDetails'
            },
            {
                // Project the final desired output format
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$productDetails.name',
                    coverImage: '$productDetails.coverImage',
                    quantitySold: '$totalQuantitySold',
                    revenueGenerated: '$totalRevenueGenerated'
                }
            }
        ]);

        res.status(200).json({ status: 'success', data: { stats } });
    } catch (error) {
        console.error("Error fetching best sellers report:", error); // Log the error
        next(error);
    }
};