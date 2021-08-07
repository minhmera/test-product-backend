const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title_vi: String,
    title_en: String,
    description_vi: String,
    description_en: String,
    photoUrl: String,
    iconUrl: String,
    type: Number,
    order: Number,
    createDate: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Categories', CategorySchema);
