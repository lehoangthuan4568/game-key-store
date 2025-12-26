// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// 1. API để tạo URL thanh toán (Frontend gọi, cần đăng nhập)
router.post('/create_vnpay_url', protect, paymentController.createPaymentUrl);

// 2. API mà VNPay gọi lại để báo kết quả (Backend-to-Backend, không cần đăng nhập)
router.get('/vnpay_ipn', paymentController.vnpayIpn);

// 3. API mà trình duyệt của người dùng được chuyển về sau khi thanh toán
router.get('/vnpay_return', paymentController.vnpayReturn);

module.exports = router;