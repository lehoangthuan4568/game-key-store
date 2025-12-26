const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationPin: String,
    pinExpires: Date,
    googleId: { type: String, unique: true, sparse: true },

    // === TRƯỜNG BỊ THIẾU LÀ ĐÂY ===
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }]
    // ===========================

}, { timestamps: true });

// Mã hóa mật khẩu (chỉ khi mật khẩu được cung cấp)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method so sánh mật khẩu (chỉ khi user có password)
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);