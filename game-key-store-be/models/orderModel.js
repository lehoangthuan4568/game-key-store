const mongoose = require('mongoose');
// Đảm bảo các model này được require để populate hoạt động
require('./productModel');
require('./platformModel');
require('./inventoryModel');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
            platform: { type: mongoose.Schema.ObjectId, ref: 'Platform', required: true },
            priceAtPurchase: { type: Number, required: true },
            // === SỬA LỖI 2: Bỏ 'required: true' ===
            purchasedKey: {
                type: mongoose.Schema.ObjectId,
                ref: 'Inventory',
                required: false, // Không bắt buộc
                unique: false,   // Đảm bảo unique là false
            }
            // ==================================
        }
    ],
    totalPrice: { type: Number, required: true },
    // === SỬA LỖI 1: Thêm 'vnpay' vào enum ===
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit-card-mock', 'e-wallet-mock', 'paypal-mock', 'vnpay'], // Thêm 'vnpay'
        default: 'credit-card-mock'
    },
    // ===================================
    status: {
        type: String,
        enum: ['completed', 'pending', 'cancelled'], // Thêm 'pending'
        default: 'pending', // Đặt mặc định là 'pending'
    }
}, { timestamps: true });

// Middleware tự động populate (đã sửa)
orderSchema.pre(/^find/, function (next) {
    this.populate('user', 'name email').populate({
        path: 'items.product',
        select: 'name slug coverImage genres'
    }).populate({
        path: 'items.purchasedKey',
        select: 'gameKey'
    }).populate({
        path: 'items.platform',
        select: 'name'
    });
    next();
});

module.exports = mongoose.model('Order', orderSchema);