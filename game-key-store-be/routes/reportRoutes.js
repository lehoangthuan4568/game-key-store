// routes/reportRoutes.js
const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect, restrictTo('admin')); // Bảo vệ tất cả

router.get('/revenue-by-period', reportController.getRevenueByPeriod);
router.get('/best-sellers', reportController.getBestSellingProducts);

module.exports = router;