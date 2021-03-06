const mongoose = require('mongoose');

const SellingPost = new mongoose.Schema({
  userId: String,
  fullName: String,
  categoryId: Number,
  productName: String,
  productPrice: Number,
  measuring: String,
  description: String,
  photoUrls: Array,
  provinceId: Number,
  districtId: Number,
  provinceName: String,
  districtName: String,
  cropDay: Date,
  productCertification: String,
  sellerPhone: String,
  createDate: { type: Date, default: Date.now },
  isApprove:Boolean

});

module.exports = mongoose.model('SellingPost', SellingPost);




