// utils/authUtils.js
const jwt = require('jsonwebtoken');

// Hàm tạo JWT token
exports.signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Hàm tạo mã PIN ngẫu nhiên (6 chữ số)
exports.createRandomPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};