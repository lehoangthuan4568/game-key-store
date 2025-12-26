// controllers/paymentController.js
const crypto = require('crypto');
const qs = require('qs');
const { format } = require('date-fns');
const Order = require('../models/orderModel');
const Inventory = require('../models/inventoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const mongoose = require('mongoose');

// === HÀM HỖ TRỢ ===

// 1. Hàm format tiền
const formatPriceVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// 2. Hàm tạo Email HTML
const createOrderConfirmationHtml = (order) => {
    // Đảm bảo order và các trường lồng nhau tồn tại
    const customerName = order.user?.name || 'Khách hàng';
    const orderId = order._id;
    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
    const total = formatPriceVND(order.totalPrice);

    const itemsHtml = order.items.map(item => `
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #4a5568;">
            <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #e2e8f0;">${item.product?.name || 'Sản phẩm không xác định'} - ${item.platform?.name || 'N/A'}</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #a0aec0;">Giá: ${formatPriceVND(item.priceAtPurchase)}</p>
            <p style="margin: 0; font-size: 14px;">
                <strong style="color: #cbd5e0;">Key của bạn:</strong><br>
                <code style="display: inline-block; background-color: #2d3748; padding: 8px 12px; border-radius: 4px; color: #63b3ed; font-size: 1.1em; margin-top: 5px; border: 1px solid #4a5568; word-break: break-all;">${item.purchasedKey?.gameKey || 'N/A'}</code>
            </p>
        </div>
    `).join('');

    // Template HTML Email (Dark mode)
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng #${orderId}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #cbd5e0; background-color: #1a202c; margin: 0; padding: 20px; }
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

// 3. Hàm sắp xếp object (Bắt buộc cho VNPay) - ĐÃ SỬA LỖI hasOwnProperty
function sortObject(obj) {
    const normalObj = { ...obj }; // Chuẩn hóa object
    let sorted = {};
    let str = [];
    let key;
    for (key in normalObj) {
        if (normalObj.hasOwnProperty(key)) { // Giờ .hasOwnProperty sẽ hoạt động
            str.push(key); // Chỉ push key, không encode
        }
    }
    str.sort(); // Sắp xếp key theo ABC
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(normalObj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
// ====================

// === HÀM 1: TẠO URL THANH TOÁN (Cho Frontend gọi) ===
exports.createPaymentUrl = async (req, res, next) => {
    try {
        const { cartItems, paymentMethod } = req.body;
        const userId = req.user.id;

        let totalAmount = 0;
        let itemsForPendingOrder = [];

        // 1. Tính toán lại tổng tiền và kiểm tra tồn kho
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) return next(new AppError(`Sản phẩm ${item.productId} không tìm thấy.`, 404));

            const stock = await Inventory.countDocuments({
                product: item.productId,
                platform: item.platformId,
                isSold: false
            });
            if (stock < item.quantity) {
                return next(new AppError(`Không đủ hàng cho ${product.name} (${item.platform.name}). Chỉ còn ${stock} key.`, 400));
            }

            const price = product.salePrice || product.price;
            totalAmount += price * item.quantity;

            for (let i = 0; i < item.quantity; i++) {
                itemsForPendingOrder.push({
                    product: item.productId,
                    platform: item.platformId,
                    priceAtPurchase: price
                });
            }
        }

        // 2. TẠO ĐƠN HÀNG PENDING
        const newOrder = await Order.create({
            user: userId,
            items: itemsForPendingOrder,
            totalPrice: totalAmount,
            paymentMethod: 'vnpay',
            status: 'pending'
        });

        // 3. CHUẨN BỊ DỮ LIỆU VNPAY
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        const createDate = format(new Date(), 'yyyyMMddHHmmss');
        const orderId = newOrder._id.toString();
        const amount = totalAmount * 100;
        const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

        const vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = process.env.VNPAY_TMNCODE;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${orderId}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount;
        vnp_Params['vnp_ReturnUrl'] = process.env.VNPAY_RETURN_URL;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        // 1. Sắp xếp và mã hóa value bằng hàm sortObject
        const sortedParams = sortObject(vnp_Params);

        const secretKey = process.env.VNPAY_HASH_SECRET;

        // 2. Dùng qs.stringify (KHÔNG encode) để tạo chuỗi hash
        const signData = qs.stringify(sortedParams, { encode: false });

        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // 3. Tạo URL cuối cùng (cũng không encode) và thêm chữ ký
        const vnpayUrl = process.env.VNPAY_URL + '?' + qs.stringify(sortedParams, { encode: false }) + '&vnp_SecureHash=' + signed;

        res.status(200).json({ status: 'success', data: { vnpayUrl } });

    } catch (error) {
        next(error);
    }
};

// === HÀM 2: VNPAY IPN (Callback từ VNPay) ===
exports.vnpayIpn = async (req, res, next) => {
    console.log("--- VNPAY IPN ĐÃ ĐƯỢC GỌI ---");
    console.log("Query gốc:", req.query);

    let vnp_Params = { ...req.query }; // Chuẩn hóa object
    let secureHash = vnp_Params['vnp_SecureHash'];
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // 1. Sắp xếp và mã hóa value bằng hàm sortObject
    vnp_Params = sortObject(vnp_Params);

    // 2. Dùng qs.stringify (KHÔNG encode) để tạo chuỗi hash
    const signData = qs.stringify(vnp_Params, { encode: false });

    let secretKey = process.env.VNPAY_HASH_SECRET;
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log("Chữ ký nhận được:", secureHash);
    console.log("Chữ ký tính toán:", signed);

    // 1. KIỂM TRA CHỮ KÝ
    if (secureHash !== signed) {
        console.error("!!! LỖI IPN: Sai chữ ký !!!");
        return res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }

    // 2. KIỂM TRA ĐƠN HÀNG
    const order = await Order.findById(orderId);
    if (!order) {
        console.error("!!! LỖI IPN: Không tìm thấy đơn hàng:", orderId);
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }

    // 3. KIỂM TRA TRẠNG THÁI
    if (order.status !== 'pending') {
        console.warn("!!! CẢNH BÁO IPN: Đơn hàng đã được xử lý:", orderId);
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    // 4. KIỂM TRA SỐ TIỀN
    let amount = Number(vnp_Params['vnp_Amount']) / 100;
    if (order.totalPrice !== amount) {
        console.error(`!!! LỖI IPN: Sai số tiền. VNPay: ${amount} | DB: ${order.totalPrice}`);
        return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
    }

    // 5. KIỂM TRA KẾT QUẢ THANH TOÁN
    if (rspCode !== '00') {
        console.log(`--- IPN: Thanh toán thất bại (Mã: ${rspCode}), Hủy đơn hàng ---`);
        order.status = 'cancelled';
        await order.save();
        return res.status(200).json({ RspCode: '00', Message: 'Order cancelled (payment failed)' });
    }

    // === THANH TOÁN THÀNH CÔNG ===
    console.log(`--- IPN: Thanh toán THÀNH CÔNG (Mã: ${rspCode}). Bắt đầu gán key... ---`);
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        let updatedItems = []; // Mảng item mới sẽ chứa key

        // Lặp qua các items trong đơn hàng 'pending'
        for (const item of order.items) {
            const foundKey = await Inventory.findOneAndUpdate(
                {
                    product: item.product,
                    platform: item.platform,
                    isSold: false
                },
                { isSold: true },
                { new: true, session, sort: { createdAt: 1 } } // Lấy key cũ nhất
            );

            if (!foundKey) {
                // Lỗi nghiêm trọng: Đã thanh toán nhưng hết hàng
                throw new Error(`Out of stock for product ${item.product} platform ${item.platform}`);
            }

            // Cập nhật item với key đã gán
            updatedItems.push({
                product: item.product,
                platform: item.platform,
                priceAtPurchase: item.priceAtPurchase,
                purchasedKey: foundKey._id // Gán key
            });
        }

        // Cập nhật đơn hàng: gán lại items (đã có key) và đổi status
        order.items = updatedItems;
        order.status = 'completed';
        await order.save({ session });

        await session.commitTransaction();
        console.log(`--- IPN: Đã gán key và hoàn thành đơn hàng ${orderId} ---`);

        // Gửi email xác nhận (sau khi transaction thành công)
        try {
            const populatedOrder = await Order.findById(orderId); // Populate tự động nhờ pre-hook
            if (populatedOrder && populatedOrder.user.email) {
                const emailHtml = createOrderConfirmationHtml(populatedOrder);
                await sendEmail({
                    email: populatedOrder.user.email,
                    subject: `[GameKeyStore] Xác nhận đơn hàng #${orderId}`,
                    html: emailHtml
                });
                console.log(`Email xác nhận (IPN) đã gửi tới ${populatedOrder.user.email}`);
            }
        } catch (emailError) {
            console.error("Lỗi gửi email IPN:", emailError);
        }

        // Phản hồi thành công cho VNPay
        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });

    } catch (error) {
        // Nếu có lỗi khi gán key (vd: hết hàng)
        await session.abortTransaction();
        console.error("!!! LỖI IPN: Lỗi khi gán key:", error.message);
        // Trả về lỗi cho VNPay -> VNPay sẽ thử lại sau
        res.status(200).json({ RspCode: '99', Message: 'Internal Error' });
    } finally {
        session.endSession();
    }
};

// === HÀM 3: VNPAY RETURN (Chuyển hướng người dùng) ===
exports.vnpayReturn = (req, res, next) => {
    console.log("--- VNPAY RETURN ĐÃ ĐƯỢC GỌI ---");
    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNPAY_HASH_SECRET;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const returnUrl = process.env.CLIENT_URL + '/payment/vnpay_return';

    if (secureHash === signed) {
        console.log("--- VNPAY RETURN: Chữ ký hợp lệ. Chuyển hướng về Frontend. ---");
        // Gửi lại query GỐC (chưa sắp xếp, chưa encode) về frontend
        res.redirect(`${returnUrl}?${qs.stringify(req.query, { encode: false })}`);
    } else {
        console.error("!!! LỖI VNPAY RETURN: Sai chữ ký !!!");
        res.redirect(`${returnUrl}?error=invalid_checksum&vnp_ResponseCode=97`);
    }
};