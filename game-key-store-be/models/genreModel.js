// models/genreModel.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thể loại không được để trống.'],
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    }
}, { timestamps: true });

// Tự động tạo slug từ name trước khi lưu
genreSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.split(' ').join('-').toLowerCase();
    }
    next();
});

module.exports = mongoose.model('Genre', genreSchema);