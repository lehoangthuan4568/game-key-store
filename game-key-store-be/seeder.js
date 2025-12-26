// seeder.js
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load models
const Product = require('./models/productModel');
const Platform = require('./models/platformModel');
const Genre = require('./models/genreModel'); // <-- THÊM MODEL MỚI

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {});

// Read JSON files
const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8'));
const platforms = JSON.parse(fs.readFileSync(`${__dirname}/data/platforms.json`, 'utf-8'));
const genres = JSON.parse(fs.readFileSync(`${__dirname}/data/genres.json`, 'utf-8')); // <-- ĐỌC FILE MỚI

// Import into DB
const importData = async () => {
    try {
        // Xóa dữ liệu cũ
        await Product.deleteMany();
        await Platform.deleteMany();
        await Genre.deleteMany(); // <-- XÓA GENRES CŨ

        // Thêm dữ liệu mới
        await Platform.create(platforms);
        await Genre.create(genres); // <-- THÊM GENRES MỚI
        // Lưu ý: Bây giờ 'products.json' của bạn cũng cần sử dụng ObjectId của genres
        await Product.create(products);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Platform.deleteMany();
        await Genre.deleteMany(); // <-- XÓA GENRES CŨ
        console.log('Data Destroyed successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}