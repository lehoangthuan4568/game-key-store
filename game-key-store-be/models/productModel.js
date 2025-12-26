const mongoose = require('mongoose');
require('./platformModel'); // Đảm bảo model 'Platform' được đăng ký
require('./inventoryModel'); // <<< THÊM DÒNG NÀY ĐỂ ĐĂNG KÝ 'INVENTORY'


const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  shortDescription: { type: String, required: true }, // TRƯỜNG MỚI
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  coverImage: { type: String, required: true }, // TRƯỜNG MỚI
  images: [String], // Gallery images
  platforms: [{ type: mongoose.Schema.ObjectId, ref: 'Platform' }],
  genres: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Genre'
  }],
  isNew: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tự động tạo slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.split(' ').join('-').toLowerCase() + '-' + Date.now();
  }
  next();
});

productSchema.virtual('inventoryCount', {
  ref: 'Inventory', // <-- Cần 'Inventory' model đã được đăng ký
  foreignField: 'product',
  localField: '_id',
  count: true
});
module.exports = mongoose.model('Product', productSchema);