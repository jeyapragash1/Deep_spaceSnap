// models/EmailVerification.js
const mongoose = require("mongoose");

// Email verification tokens
const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);
const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerification;
