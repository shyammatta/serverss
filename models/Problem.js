const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  text: String,
  videoUrl: String,
  village: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
