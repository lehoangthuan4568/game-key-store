// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect, restrictTo('admin')); // Bảo vệ tất cả

router.get('/users', adminController.getAllUsers);

// === ROUTES MỚI ===
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', adminController.updateUserRole);
// =================

module.exports = router;