// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // --- ADD THE NEW ROLE FIELD ---
  role: {
    type: String,
    enum: ['registered_user', 'premium_user', 'designer', 'admin'], // Defines the possible roles
    default: 'registered_user', // New users will automatically get this role
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);