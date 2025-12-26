const Inventory = require('../models/inventoryModel');
const AppError = require('../utils/appError');
const multer = require('multer');
const fs = require('fs');

// Cấu hình Multer để lưu file tạm
const upload = multer({ dest: 'temp/' });
exports.uploadKeysFile = upload.single('keysFile');

// Lấy tất cả key của một sản phẩm (có phân trang)
exports.getAllInventoryForProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;
        const skip = (page - 1) * limit;

        const filter = { product: productId };

        const keys = await Inventory.find(filter)
            .populate('platform', 'name')
            .skip(skip)
            .limit(limit);

        const totalKeys = await Inventory.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            results: keys.length,
            totalPages: Math.ceil(totalKeys / limit),
            data: { keys },
        });

    } catch (error) {
        next(error);
    }
};

// Thêm một key duy nhất
exports.addSingleKey = async (req, res, next) => {
    try {
        const { product, platform, gameKey } = req.body;
        if (!product || !platform || !gameKey) {
            return next(new AppError('Vui lòng cung cấp đủ thông tin.', 400));
        }
        const newKey = await Inventory.create({ product, platform, gameKey });
        res.status(201).json({ status: 'success', data: { key: newKey } });
    } catch (error) {
        next(error);
    }
};

// Thêm key hàng loạt từ file .txt
exports.addKeysBulk = async (req, res, next) => {
    try {
        if (!req.file) return next(new AppError('Vui lòng tải lên file.', 400));

        const { product, platform } = req.body;
        if (!product || !platform) return next(new AppError('Vui lòng cung cấp ID sản phẩm và nền tảng.', 400));

        const keys = fs.readFileSync(req.file.path, 'utf-8').split(/\r?\n/).filter(Boolean);
        fs.unlinkSync(req.file.path);

        const inventoryDocs = keys.map(key => ({ product, platform, gameKey: key.trim() }));
        const newKeys = await Inventory.insertMany(inventoryDocs);

        res.status(201).json({ status: 'success', message: `Đã thêm ${newKeys.length} key.`, data: newKeys });
    } catch (error) {
        next(error);
    }
};

// Cập nhật một key (chỉ khi chưa bán)
exports.updateKey = async (req, res, next) => {
    try {
        const keyToUpdate = await Inventory.findById(req.params.id);
        if (!keyToUpdate) return next(new AppError('Không tìm thấy key.', 404));
        if (keyToUpdate.isSold) return next(new AppError('Không thể cập nhật key đã bán.', 403));

        const updatedKey = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: { key: updatedKey } });
    } catch (error) {
        next(error);
    }
};

// Xóa một key (chỉ khi chưa bán)
exports.deleteKey = async (req, res, next) => {
    try {
        const keyToDelete = await Inventory.findById(req.params.id);
        if (!keyToDelete) return next(new AppError('Không tìm thấy key.', 404));
        if (keyToDelete.isSold) return next(new AppError('Không thể xóa key đã bán.', 403));

        await Inventory.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};