// spacesnap-backend/models/Setting.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main-settings'
  },
  featureFlags: {
    arPreviewEnabled: { type: Boolean, default: true },
    styleQuizActive: { type: Boolean, default: true },
    newRegistrations: { type: Boolean, default: true },
  },
  // --- THIS IS THE MODIFIED PART ---
  paymentGateway: {
    stripeEnabled: { type: Boolean, default: true },
    // This key is safe to send to the frontend
    stripePublishableKey: { type: String, trim: true, default: '' },
    // This key should NEVER be sent to the frontend
    stripeSecretKey: { type: String, trim: true, default: '' },
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);