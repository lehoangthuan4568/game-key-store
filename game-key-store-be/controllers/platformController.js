// controllers/platformController.js
const Platform = require('../models/platformModel');
const AppError = require('../utils/appError');

// Lấy tất cả (public)
exports.getAllPlatforms = async (req, res, next) => {
    try {
        const platforms = await Platform.find().sort('name');
        res.status(200).json({
            status: 'success',
            results: platforms.length,
            data: { platforms }
        });
    } catch (error) {
        next(error);
    }
};

// === CÁC HÀM MỚI CHO ADMIN ===
exports.createPlatform = async (req, res, next) => {
    try {
        const newPlatform = await Platform.create(req.body);
        res.status(201).json({ status: 'success', data: { platform: newPlatform } });
    } catch (error) {
        next(error);
    }
};

exports.updatePlatform = async (req, res, next) => {
    try {
        const platform = await Platform.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!platform) return next(new AppError('Không tìm thấy nền tảng.', 404));
        res.status(200).json({ status: 'success', data: { platform } });
    } catch (error) {
        next(error);
    }
};

exports.deletePlatform = async (req, res, next) => {
    try {
        const platform = await Platform.findByIdAndDelete(req.params.id);
        if (!platform) return next(new AppError('Không tìm thấy nền tảng.', 404));
        // TODO: Xóa nền tảng này khỏi tất cả sản phẩm đang dùng nó (nâng cao)
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};