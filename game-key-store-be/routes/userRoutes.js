// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả các route bên dưới đều yêu cầu đăng nhập
router.use(protect);

// === ROUTE MỚI ===
// Endpoint để lấy thông tin user hiện tại (dựa trên token)
router.get('/me', userController.getMe);
// =================

router.get('/wishlist', userController.getMyWishlist);
router.post('/wishlist/:productId', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

module.exports = router;