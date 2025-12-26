// controllers/genreController.js
const Genre = require('../models/genreModel');
const AppError = require('../utils/appError');

// Lấy tất cả thể loại (không phân trang, để load vào bộ lọc)
exports.getAllGenres = async (req, res, next) => {
    try {
        const genres = await Genre.find().sort('name');
        res.status(200).json({
            status: 'success',
            results: genres.length,
            data: { genres }
        });
    } catch (error) {
        next(error);
    }
};

// Tạo thể loại mới
exports.createGenre = async (req, res, next) => {
    try {
        const newGenre = await Genre.create(req.body); // req.body = { name: "..." }
        res.status(201).json({ status: 'success', data: { genre: newGenre } });
    } catch (error) {
        next(error);
    }
};

// Cập nhật thể loại
exports.updateGenre = async (req, res, next) => {
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!genre) return next(new AppError('Không tìm thấy thể loại.', 404));
        res.status(200).json({ status: 'success', data: { genre } });
    } catch (error) {
        next(error);
    }
};

// Xóa thể loại
exports.deleteGenre = async (req, res, next) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) return next(new AppError('Không tìm thấy thể loại.', 404));
        // TODO: Xóa thể loại này khỏi tất cả sản phẩm đang dùng nó (nâng cao)
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};