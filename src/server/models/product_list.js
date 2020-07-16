const mongoose = require('mongoose');

const ProductListSchema = new mongoose.Schema({
  title: String,
  description: String,
  photoUrl: String,
  order: Number,
  type: Number,
  createDate: { type: Date, default: Date.now },

});

module.exports = mongoose.model('ProductList', ProductListSchema);