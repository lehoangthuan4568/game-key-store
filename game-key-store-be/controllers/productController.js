// controllers/productController.js
const Product = require('../models/productModel');
const Inventory = require('../models/inventoryModel');
const AppError = require('../utils/appError');
// Đảm bảo các model này được 'require' để Mongoose đăng ký chúng
require('../models/platformModel');
require('../models/inventoryModel');
require('../models/genreModel');

// 1. Lấy tất cả sản phẩm (cho trang chủ, trang sản phẩm, admin)
exports.getAllProducts = async (req, res, next) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'sale', 'platforms', 'genres', 'isFeatured', 'isNew', 'isHot'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let filter = JSON.parse(queryStr);

        // --- Xử lý lọc giá (Đã sửa lỗi) ---
        const priceFilter = {};
        if (req.query['price[gte]']) {
            const gteValue = Number(req.query['price[gte]']);
            if (!isNaN(gteValue)) priceFilter.$gte = gteValue;
        }
        if (req.query['price[lte]']) {
            const lteValue = Number(req.query['price[lte]']);
            if (!isNaN(lteValue)) priceFilter.$lte = lteValue;
        }
        // Xóa các key price[...] gốc khỏi filter
        delete filter['price[$gte]'];
        delete filter['price[$lte]'];
        delete filter['price[gt]'];
        delete filter['price[lt]'];
        // Chỉ thêm 'price' vào filter nếu có điều kiện hợp lệ
        if (Object.keys(priceFilter).length > 0) {
            filter.price = priceFilter;
        }
        // ---------------------------------

        // Lọc Sale
        if (req.query.sale === 'true') {
            filter.salePrice = { $ne: null };
        }
        // Lọc isFeatured, isNew, isHot (boolean)
        if (req.query.isFeatured === 'true') {
            filter.isFeatured = true;
        }
        if (req.query.isNew === 'true') {
            filter.isNew = true;
        }
        if (req.query.isHot === 'true') {
            filter.isHot = true;
        }
        // Lọc Nền tảng
        if (req.query.platforms) {
            const platformIds = req.query.platforms.split(',');
            filter.platforms = { $in: platformIds };
        }
        // Lọc Thể loại
        if (req.query.genres) {
            const genreIds = req.query.genres.split(',');
            filter.genres = { $in: genreIds };
        }
        // Lọc Tìm kiếm
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }

        let query = Product.find(filter);

        // Sắp xếp
        if (req.query.sort) {
            const sortBy = req.query.sort;
            if (sortBy === 'price') query = query.sort({ price: 1 });
            else if (sortBy === '-price') query = query.sort({ price: -1 });
            else if (sortBy === 'name') query = query.sort({ name: 1 });
            else if (sortBy === '-name') query = query.sort({ name: -1 });
            else query = query.sort(sortBy.split(',').join(' ')); // vd: -createdAt
        } else {
            query = query.sort('-createdAt'); // Mặc định
        }

        // Phân trang
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 15; // Giới hạn mặc định
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // Thực thi query
        const products = await query
            .populate('platforms', 'name slug')
            .populate('genres', 'name slug')
            .populate('inventoryCount');

        // Đếm tổng số sản phẩm khớp filter (cho phân trang)
        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            totalPages: Math.ceil(totalProducts / limit),
            results: products.length,
            currentPage: page,
            data: { products },
        });
    } catch (error) {
        console.error("!!! LỖI TRONG getAllProducts:", error); // Log lỗi ra
        next(error);
    }
};

// 2. Lấy chi tiết sản phẩm (theo Slug)
exports.getProductBySlug = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('platforms', 'name slug')
            .populate('genres', 'name slug');

        if (!product) {
            return next(new AppError('Không tìm thấy sản phẩm.', 404));
        }

        // Tính tồn kho theo từng nền tảng
        const stockPromises = product.platforms.map(async (platform) => {
            const count = await Inventory.countDocuments({
                product: product._id,
                platform: platform._id,
                isSold: false
            });
            return { platformId: platform._id, count };
        });
        const stockCounts = await Promise.all(stockPromises);
        const stockByPlatform = stockCounts.reduce((acc, item) => {
            acc[item.platformId] = item.count;
            return acc;
        }, {});

        const productData = product.toObject();
        productData.stockByPlatform = stockByPlatform;
        productData.inventoryCount = stockCounts.reduce((sum, item) => sum + item.count, 0);

        res.status(200).json({ status: 'success', data: { product: productData } });
    } catch (error) {
        next(error);
    }
};

// 3. Lấy sản phẩm theo ID (cho Admin)
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('platforms', 'name slug')
            .populate('genres', 'name slug');

        if (!product) {
            return next(new AppError('Không tìm thấy sản phẩm với ID này.', 404));
        }
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

// 4. Lấy sản phẩm liên quan
exports.getRelatedProducts = async (req, res, next) => {
    try {
        const currentProduct = await Product.findById(req.params.id);
        if (!currentProduct) return next(new AppError('Không tìm thấy sản phẩm gốc.', 404));

        const products = await Product.find({
            _id: { $ne: req.params.id },
            $or: [
                { platforms: { $in: currentProduct.platforms } },
                { genres: { $in: currentProduct.genres } }
            ]
        })
            .limit(4)
            .populate('platforms', 'name slug')
            .populate('genres', 'name slug')
            .populate('inventoryCount');

        res.status(200).json({ status: 'success', data: { products } });
    } catch (error) {
        next(error);
    }
};

// --- Admin Functions ---

// 5. Tạo sản phẩm
exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ status: 'success', data: { product: newProduct } });
    } catch (error) {
        next(error);
    }
};

// 6. Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return next(new AppError('Không tìm thấy sản phẩm với ID này.', 404));
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

// 7. Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return next(new AppError('Không tìm thấy sản phẩm với ID này.', 404));
        // Xóa luôn các key trong kho
        await Inventory.deleteMany({ product: productId });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};