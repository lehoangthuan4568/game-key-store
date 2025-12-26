const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Xử lý các lỗi đồng bộ chưa được bắt
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config();
const app = require('./app'); // Giả sử bạn có file app.js chứa cấu hình express

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => console.log('MongoDB Connected...'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

// Xử lý các lỗi bất đồng bộ chưa được bắt (Promise rejections)
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});