// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['registered', 'premium', 'designer', 'admin'], // Only these values are allowed
    default: 'registered',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;