var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    title: String,
    description: String,
    createDate: String,

});

module.exports = mongoose.model('News', NewsSchema);
