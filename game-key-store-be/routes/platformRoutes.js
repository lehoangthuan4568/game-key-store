// routes/platformRoutes.js
const express = require('express');
const platformController = require('../controllers/platformController');
const { protect, restrictTo } = require('../middlewares/authMiddleware'); // Import
const router = express.Router();

// Lấy tất cả (public)
router.get('/', platformController.getAllPlatforms);

// === CÁC ROUTE MỚI CHO ADMIN ===
router.use(protect, restrictTo('admin')); // Bảo vệ các route bên dưới
router.post('/', platformController.createPlatform);
router.patch('/:id', platformController.updatePlatform);
router.delete('/:id', platformController.deletePlatform);

module.exports = router;