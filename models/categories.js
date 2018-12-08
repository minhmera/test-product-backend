var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    title: String,
    description: String,
    photoUrl: String,
    order:Number,
    createDate: {type: Date, default: Date.now} ,

});

module.exports = mongoose.model('Categories', CategorySchema);
