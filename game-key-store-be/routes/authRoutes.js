// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const passport = require('passport'); // Import Passport

const router = express.Router();

// --- Các route xác thực cơ bản ---
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-pin', authController.resendVerificationPin);
router.post('/login', authController.login);

// --- Các route cho luồng quên mật khẩu ---
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-pin', authController.verifyPin);
router.patch('/reset-password', authController.resetPassword);

// --- Route đổi mật khẩu (cần đăng nhập) ---
router.patch('/update-my-password', protect, authController.updatePassword);

// === GOOGLE OAUTH ROUTES ===
// Bước 1: Người dùng nhấn link -> Chuyển đến Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // Yêu cầu lấy thông tin profile và email
    session: false // Không sử dụng session
}));

// Bước 2: Google chuyển hướng về đây sau khi xác thực
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, // Chuyển về trang login nếu thất bại
        session: false // Không sử dụng session
    }),
    authController.googleCallback // Nếu thành công, gọi hàm này
);
// ==========================

module.exports = router;