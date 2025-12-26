const User = require('../models/userModel');
const Product = require('../models/productModel'); // Cần để populate
const AppError = require('../utils/appError');

// Lấy danh sách yêu thích của người dùng hiện tại
exports.getMyWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            // === CẬP NHẬT POPULATE LỒNG NHAU ===
            select: 'name slug price salePrice coverImage genres', // Thêm genres ở đây
            populate: [
                { path: 'inventoryCount' }, // Populate trường ảo
                { path: 'genres', select: 'name slug' } // Populate chi tiết genres
            ]
            // ===================================
        });

        if (!user) {
            return next(new AppError('Không tìm thấy người dùng.', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                wishlist: user.wishlist
            }
        });
    } catch (error) {
        console.error("!!! LỖI TRONG getMyWishlist:", error);
        next(error);
    }
};

// Thêm sản phẩm vào danh sách yêu thích
exports.addToWishlist = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const user = await User.findByIdAndUpdate(req.user.id,
            { $addToSet: { wishlist: productId } },
            { new: true }
        );
        if (!user) return next(new AppError('Không tìm thấy người dùng.', 404));
        res.status(200).json({
            status: 'success',
            message: 'Đã thêm vào danh sách yêu thích.',
            data: { wishlist: user.wishlist }
        });
    } catch (error) {
        next(error);
    }
};

// Xóa sản phẩm khỏi danh sách yêu thích
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const user = await User.findByIdAndUpdate(req.user.id,
            { $pull: { wishlist: productId } },
            { new: true }
        );
        if (!user) return next(new AppError('Không tìm thấy người dùng.', 404));
        res.status(200).json({
            status: 'success',
            message: 'Đã xóa khỏi danh sách yêu thích.',
            data: { wishlist: user.wishlist }
        });
    } catch (error) {
        next(error);
    }
};

// Lấy thông tin user hiện tại (cho Google Login)
exports.getMe = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};