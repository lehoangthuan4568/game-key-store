// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
  console.log('--- Đang chạy middleware PROTECT ---'); // DEBUG
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Bạn chưa đăng nhập.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('Người dùng không còn tồn tại.', 401));
    }

    req.user = currentUser;
    console.log('--- PROTECT thành công ---'); // DEBUG
    next();
  } catch(error) {
    console.error('!!! LỖI TRONG PROTECT MIDDLEWARE:', error); // DEBUG
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn.', 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('--- Đang chạy middleware RESTRICTTO ---'); // DEBUG
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện hành động này.', 403));
    }
    console.log('--- RESTRICTTO thành công ---'); // DEBUG
    next();
  };
};