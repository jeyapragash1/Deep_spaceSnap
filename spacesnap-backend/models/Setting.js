// models/Setting.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  // Using a single document to store all settings is efficient
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main-settings' // We will only ever have one document with this key
  },
  featureFlags: {
    arPreviewEnabled: { type: Boolean, default: true },
    styleQuizActive: { type: Boolean, default: true },
    newRegistrations: { type: Boolean, default: true },
  },
  paymentGateway: {
    stripeEnabled: { type: Boolean, default: false },
    stripeApiKey: { type: String, default: '' },
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);