const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  photoUrl: String,
  createDate: { type: Date, default: Date.now },

});

module.exports = mongoose.model('News', NewsSchema);
