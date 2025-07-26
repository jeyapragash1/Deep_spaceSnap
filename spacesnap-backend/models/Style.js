const mongoose = require('mongoose');

const StyleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  characteristics: [String],
  colorPalette: [String],
  keyElements: [String],
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Style', StyleSchema);