const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport'); // Import Passport

// Import cấu hình Passport (để nó chạy)
require('./config/passport');

// --- Import tất cả các file Routes ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const platformRoutes = require('./routes/platformRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes'); // <-- IMPORT MỚI
const paymentRoutes = require('./routes/paymentRoutes'); // IMPORT MỚI
const uploadRoutes = require('./routes/uploadRoutes'); // IMPORT MỚI
const app = express();

// --- Middlewares ---

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:5173', // Chỉ cho phép frontend này truy cập
    credentials: true               // Cho phép gửi cookie, header Authorization
}));

// Ghi log request (chỉ trong môi trường development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Đọc req.body dạng JSON
app.use(express.json());

// Phục vụ file tĩnh từ thư mục 'public' (nếu có, vd: ảnh sản phẩm)
app.use(express.static(`${__dirname}/public`));

// Khởi tạo Passport
app.use(passport.initialize());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes); // (User routes, vd: wishlist)
app.use('/api/genres', genreRoutes); // <-- THÊM ROUTE MỚI
app.use('/api/payment', paymentRoutes); // THÊM ROUTE MỚI
app.use('/api/upload', uploadRoutes); // THÊM ROUTE UPLOAD

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.error("!!! GLOBAL ERROR HANDLER:", err.message, err.stack); // Thêm log lỗi chi tiết

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Chỉ hiển thị stack trace ở môi trường dev
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

module.exports = app;