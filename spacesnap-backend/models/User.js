// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Built-in Node.js module

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String }, // NEW: Phone number field
  role: { type: String, enum: ['registered', 'premium', 'designer', 'admin'], default: 'registered' },
  isVerified: { type: Boolean, default: false }, // NEW: To track if OTP verification is done
  otp: { type: String }, // NEW: To store the OTP
  otpExpire: { type: Date }, // NEW: To set an expiry time for the OTP
  resetPasswordToken: { type: String }, // NEW: For forgot password
  resetPasswordExpire: { type: Date }, // NEW: Expiry for forgot password token
}, { timestamps: true });

// --- PASSWORD HASHING (This is perfect, no changes needed) ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- NEW METHOD: Generate Password Reset Token ---
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expiry time (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;