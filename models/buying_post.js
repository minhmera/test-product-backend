const mongoose = require('mongoose');

const BuyingPost = new mongoose.Schema({
  userId: String,
  photoUrls: Array,
  fullName: String,
  categoryId: Number,
  productName: String,
  productPrice: Number,
  measuring: String,
  description: String,
  provinceId: Number,
  districtId: Number,
  provinceName: String,
  districtName: String,
  productCertification: String,
  buyerPhone: String,
  createDate: { type: Date, default: Date.now },
  isApprove:Boolean

});

module.exports = mongoose.model('BuyingPost', BuyingPost);
