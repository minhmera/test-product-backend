const mongoose = require('mongoose');

const BuyingPost = new mongoose.Schema({
  categoryId: Number,
  productName: String,
  provinceId: Number,
  districtId: Number,
  productCertification: String,
  buyerPhone: String,

});

module.exports = mongoose.model('BuyingPost', BuyingPost);
