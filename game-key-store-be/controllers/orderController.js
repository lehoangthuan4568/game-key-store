// controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Inventory = require('../models/inventoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email'); // Đảm bảo đã import hàm gửi mail

// === CÁC HÀM HỖ TRỢ ===

// 1. Hàm format tiền tệ
const formatPriceVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// 2. Hàm tạo nội dung Email HTML (Dark mode)
const createOrderConfirmationHtml = (order) => {
    const customerName = order.user.name;
    const orderId = order._id;
    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
    const total = formatPriceVND(order.totalPrice);

    // Xử lý danh sách items
    const itemsHtml = order.items.map(item => `
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #4a5568;">
            <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #e2e8f0;">${item.product.name} - ${item.platform.name}</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #a0aec0;">Giá: ${formatPriceVND(item.priceAtPurchase)}</p>
            <p style="margin: 0; font-size: 14px;">
                <strong style="color: #cbd5e0;">Key của bạn:</strong><br>
                <code style="display: inline-block; background-color: #2d3748; padding: 8px 12px; border-radius: 4px; color: #63b3ed; font-size: 1.1em; margin-top: 5px; border: 1px solid #4a5568; word-break: break-all;">${item.purchasedKey.gameKey}</code>
            </p>
        </div>
    `).join('');

    // Template HTML Email
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng #${orderId}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #cbd5e0; background-color: #1a202c; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #2d3748; padding: 30px; border-radius: 8px; border: 1px solid #4a5568; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #63b3ed; margin: 0; font-size: 24px;}
            .order-details { font-size: 14px; color: #a0aec0; margin-bottom: 20px; text-align: center;}
            .items-section h2 { font-size: 18px; color: #e2e8f0; margin-bottom: 15px; border-bottom: 1px solid #4a5568; padding-bottom: 10px;}
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 30px; padding-top: 15px; border-top: 1px solid #4a5568; color: #cbd5e0; }
            .total span { color: #63b3ed; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #718096; }
            .footer a { color: #63b3ed; text-decoration: none; }
            .account-link { color: #a0aec0; }
            .account-link a { color: #63b3ed; }
            code { background-color: #1a202c; padding: 2px 5px; border-radius: 4px; color: #90cdf4; font-family: monospace; word-break: break-all;}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>Cảm ơn bạn đã mua hàng!</h1></div>
            <p style="color: #e2e8f0; text-align: center; margin-bottom: 15px;">Chào ${customerName}, đơn hàng của bạn đã được xác nhận.</p>
            <div class="order-details"><span>Mã đơn hàng: #${orderId}</span> &bull; <span>Ngày đặt: ${orderDate}</span></div>
            <div class="items-section"><h2>Chi tiết đơn hàng & Key Game</h2>${itemsHtml}</div>
            <div class="total">Tổng cộng: <span>${total}</span></div>
            <p style="margin-top: 30px; text-align: center; font-size: 14px;" class="account-link">Xem lịch sử đơn hàng tại <a href="http://localhost:5173/user/my-orders">tài khoản của bạn</a>.</p>
            <div class="footer"><p>&copy; ${new Date().getFullYear()} GameKeyStore</p><p><a href="http://localhost:5173">Ghé thăm cửa hàng</a></p></div>
        </div>
    </body>
    </html>
    `;
};


// === CÁC HÀM CONTROLLER ===

// 1. CREATE ORDER (Dùng cho thanh toán MOCK - Hiện tại không dùng nếu chỉ có VNPay)
// Hàm này được giữ lại để tham khảo hoặc nếu bạn muốn thêm lại thanh toán Mock
exports.createOrder = async (req, res, next) => {
    // cartItems nhận [{ productId, platformId, quantity }]
    const { cartItems, paymentMethod } = req.body;
    const session = await mongoose.startSession();
    let createdOrder = null;

    try {
        session.startTransaction();
        const processedItems = [];
        let totalPrice = 0;

        for (const item of cartItems) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) throw new AppError(`Sản phẩm không tìm thấy: ${item.productId}`, 404);

            const currentPrice = product.salePrice || product.price;

            const availableStock = await Inventory.countDocuments({
                product: item.productId,
                platform: item.platformId,
                isSold: false
            }).session(session);

            if (availableStock < item.quantity) {
                throw new AppError(`Không đủ hàng cho ${product.name} (${item.platform.name}). Chỉ còn ${availableStock} key.`, 400);
            }

            const keysToSell = await Inventory.find({
                product: item.productId,
                platform: item.platformId,
                isSold: false
            }).limit(item.quantity).session(session);

            for (const keyDoc of keysToSell) {
                keyDoc.isSold = true;
                await keyDoc.save({ session });

                processedItems.push({
                    product: item.productId,
                    platform: item.platformId,
                    priceAtPurchase: currentPrice,
                    purchasedKey: keyDoc._id
                });

                totalPrice += currentPrice;
            }
        }

        const newOrderArr = await Order.create([{
            user: req.user.id,
            items: processedItems,
            totalPrice,
            paymentMethod
        }], { session });

        createdOrder = await Order.findById(newOrderArr[0]._id)
            .populate([
                { path: 'user', select: 'name email' },
                { path: 'items.product', select: 'name slug coverImage' },
                { path: 'items.platform', select: 'name' },
                { path: 'items.purchasedKey', select: 'gameKey' }
            ])
            .session(session);

        if (!createdOrder) throw new AppError('Không thể lấy chi tiết đơn hàng vừa tạo.', 500);

        await session.commitTransaction();

        res.status(201).json({ status: 'success', data: { order: createdOrder } });

    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }

    // Gửi email sau khi đã response
    if (createdOrder) {
        try {
            if (createdOrder.user?.email) {
                const emailHtml = createOrderConfirmationHtml(createdOrder);
                await sendEmail({
                    email: createdOrder.user.email,
                    subject: `[GameKeyStore] Xác nhận đơn hàng #${createdOrder._id}`,
                    html: emailHtml
                });
                console.log(`Email xác nhận đã gửi tới ${createdOrder.user.email}`);
            }
        } catch (emailError) {
            console.error("Lỗi gửi email:", emailError);
        }
    }
};

// 2. GET MY ORDERS (Dùng cho user)
exports.getMyOrders = async (req, res, next) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 5; // 5 đơn hàng mỗi trang
        const skip = (page - 1) * limit;

        const filter = { user: req.user.id };

        const orders = await Order.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);
        // Populate tự động chạy nhờ pre-hook trong orderModel.js

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            results: orders.length,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};


// 3. GET ALL ORDERS (Dùng cho Admin)
exports.getAllOrders = async (req, res, next) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        const filter = {}; // Admin có thể xem tất cả

        const orders = await Order.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);
        // Populate tự động chạy nhờ pre-hook

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            results: orders.length,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};