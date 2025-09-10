// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    password: {
      type: String,
      required: function () {
        return this.authMethod === "email"; // Only require password if using email method
      },
    },

    phoneNumber: { type: String },
    address: { type: String },

    // For traditional login or Google login
    authMethod: {
      type: String,
      enum: ["email", "google"],
      required: true,
    },

    isEmailVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // For OTP verification (if separate from email)

    otp: { type: String },                // One-Time Password for verification
    otpExpire: { type: Date },           // OTP expiration timestamp

    resetPasswordToken: { type: String },   // Hashed token for password reset
    resetPasswordExpire: { type: Date },    // Token expiry time

    avatar: {
      type: String,
      default: "http://localhost:5173/default-avatar.svg",
    },

    role: {
      type: String,
      enum: ["registered", "premium", "designer", "admin"],
      default: "registered",
    },

    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },

    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);


// --- 🔐 COMPARE PASSWORD ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- 🔁 LOGIN ATTEMPTS MANAGEMENT ---
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hrs
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// --- 🔁 GENERATE RESET TOKEN ---
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
