var mongoose = require('mongoose');

var ProductListSchema = new mongoose.Schema({
    title: String,
    description: String,
    photoUrl: String,
    order:Number,
    type:Number,
    location:String,
    createDate: {type: Date, default: Date.now} ,

});

module.exports = mongoose.model('ProductList', ProductListSchema);
