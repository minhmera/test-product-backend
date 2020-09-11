const mongoose = require('mongoose');

const SellingPost = new mongoose.Schema({
  categoryId: Number,
  productName: String,
  photoUrls: Array,
  provinceId: Number,
  districtId: Number,
  cropDay: Date,
  productCertification: String,
  sellerPhone: String,

});

module.exports = mongoose.model('SellingPost', SellingPost);



