const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: timestamp-random-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// Filter chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new AppError('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif, webp)', 400), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

// Upload single image
exports.uploadSingleImage = upload.single('image');

// Upload multiple images
exports.uploadMultipleImages = upload.array('images', 10); // Tối đa 10 ảnh

// Controller xử lý upload single image
exports.uploadImage = (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Vui lòng chọn file ảnh', 400));
    }

    // Trả về URL của ảnh (relative path từ public)
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
        status: 'success',
        data: {
            imageUrl: imageUrl,
            filename: req.file.filename
        }
    });
};

// Controller xử lý upload multiple images
exports.uploadImages = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('Vui lòng chọn ít nhất một file ảnh', 400));
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    res.status(200).json({
        status: 'success',
        data: {
            imageUrls: imageUrls,
            count: req.files.length
        }
    });
};

