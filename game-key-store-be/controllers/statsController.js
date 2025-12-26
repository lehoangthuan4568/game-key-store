// controllers/statsController.js
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');

exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const revenueStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);
        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

        const recentOrders = await Order.find()
            .sort('-createdAt')
            .limit(5)
            .populate('user', 'name');

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};