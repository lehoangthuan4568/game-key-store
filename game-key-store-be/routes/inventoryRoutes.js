// routes/inventoryRoutes.js
const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Áp dụng middleware bảo vệ cho tất cả các route bên dưới
// Chỉ có người dùng đã đăng nhập và có vai trò 'admin' mới có thể truy cập
router.use(protect, restrictTo('admin'));

// Route để thêm key hàng loạt từ file
router.post(
    '/bulk',
    inventoryController.uploadKeysFile, // Middleware xử lý file upload
    inventoryController.addKeysBulk
);

// Route để thêm một key duy nhất
router.post('/', inventoryController.addSingleKey);

// Route để lấy tất cả key của một sản phẩm
router.get('/:productId', inventoryController.getAllInventoryForProduct);

// Route để cập nhật một key
router.patch('/:id', inventoryController.updateKey);

// Route để xóa một key
router.delete('/:id', inventoryController.deleteKey);


module.exports = router;