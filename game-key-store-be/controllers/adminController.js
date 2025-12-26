// controllers/adminController.js
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 15;
        const skip = (page - 1) * limit;

        // --- LOGIC TÌM KIẾM MỚI ---
        let filter = {};
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' }; // 'i' = không phân biệt hoa thường
            filter = {
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            };
        }
        // -------------------------

        const users = await User.find(filter).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments(filter); // Đếm dựa trên filter

        res.status(200).json({
            status: 'success',
            results: users.length,
            totalPages: Math.ceil(totalUsers / limit),
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

// --- HÀM MỚI: XÓA NGƯỜI DÙNG ---
exports.deleteUser = async (req, res, next) => {
    try {
        // RÀNG BUỘC: Không cho phép xóa chính mình
        if (req.params.id === req.user.id) {
            return next(new AppError('Bạn không thể xóa tài khoản của chính mình.', 403)); // 403 = Forbidden
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new AppError('Không tìm thấy người dùng với ID này.', 404));
        }

        res.status(204).json({ status: 'success', data: null }); // 204 = No Content
    } catch (error) {
        next(error);
    }
};

// --- HÀM MỚI: CẬP NHẬT VAI TRÒ ---
exports.updateUserRole = async (req, res, next) => {
    try {
        // RÀNG BUỘC: Không cho phép tước quyền admin của chính mình
        if (req.params.id === req.user.id) {
            return next(new AppError('Bạn không thể thay đổi vai trò của chính mình.', 403));
        }

        // Lấy vai trò mới từ body (vd: { role: 'admin' } hoặc { role: 'user' })
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            return next(new AppError('Vai trò không hợp lệ.', 400));
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, {
            new: true, // Trả về document đã cập nhật
            runValidators: true
        });

        if (!user) {
            return next(new AppError('Không tìm thấy người dùng với ID này.', 404));
        }

        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        next(error);
    }
};