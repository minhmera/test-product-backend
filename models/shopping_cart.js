
const mongoose = require('mongoose');

const ShoppingCart = new mongoose.Schema({
    sellerId: String,
    buyers: Array,


});

module.exports = mongoose.model('ShoppingCart', ShoppingCart);


