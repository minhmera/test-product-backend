var mongoose = require('mongoose');

var ProductListSchema = new mongoose.Schema({
    title: String,
    harvestDate: String,
    price:Number,
    unit:Number,
    amount:Number,
    //photoUrl: String,
    photoUrls: [{
        type: String
    }],
    description: String,
    order:Number,
    type:Number,
    location:String,
    createDate: {type: Date, default: Date.now} ,

});

module.exports = mongoose.model('ProductList', ProductListSchema);
