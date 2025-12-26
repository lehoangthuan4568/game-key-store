// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Tất cả đều cần đăng nhập

// XÓA DÒNG NÀY:
// router.post('/', orderController.createOrder);

// GIỮ LẠI CÁC ROUTE NÀY:
router.get('/my-orders', orderController.getMyOrders);
router.use(restrictTo('admin'));
router.get('/', orderController.getAllOrders);

module.exports = router;