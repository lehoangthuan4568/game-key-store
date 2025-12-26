const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Các route công khai cho mọi người
router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
// Route để lấy sản phẩm theo ID (dành cho inventorySlice)
router.get('/id/:id', productController.getProductById); 
// Route để lấy sản phẩm liên quan
router.get('/:id/related', productController.getRelatedProducts);

// === KHÔI PHỤC LẠI CÁC ROUTE CỦA ADMIN ===
// Middleware sẽ được áp dụng cho tất cả các route bên dưới nó
router.use(protect, restrictTo('admin')); 

router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
// ==========================================

module.exports = router;