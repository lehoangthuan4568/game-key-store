// models/inventoryModel.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    platform: {
        type: mongoose.Schema.ObjectId,
        ref: 'Platform',
        required: true,
    },
    gameKey: {
        type: String,
        required: true,
        unique: true, // Mỗi key là duy nhất
        trim: true,
    },
    isSold: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);