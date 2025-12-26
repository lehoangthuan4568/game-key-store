// routes/statsRoutes.js
const express = require('express');
const statsController = require('../controllers/statsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Chỉ admin mới có quyền truy cập
router.get('/', protect, restrictTo('admin'), statsController.getStats);

module.exports = router;