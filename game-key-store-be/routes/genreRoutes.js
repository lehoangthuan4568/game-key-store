// routes/genreRoutes.js
const express = require('express');
const genreController = require('../controllers/genreController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Lấy tất cả (public cho frontend)
router.get('/', genreController.getAllGenres);

// Các route còn lại chỉ cho Admin
router.use(protect, restrictTo('admin'));
router.post('/', genreController.createGenre);
router.patch('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;