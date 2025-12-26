const express = require('express');
const uploadController = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả route upload đều cần đăng nhập và là admin
router.use(protect, restrictTo('admin'));

// Upload single image
router.post('/single', uploadController.uploadSingleImage, uploadController.uploadImage);

// Upload multiple images
router.post('/multiple', uploadController.uploadMultipleImages, uploadController.uploadImages);

module.exports = router;

