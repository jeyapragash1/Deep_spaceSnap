// models/EmailTemplate.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
  name: { // A unique identifier for the template, e.g., 'welcome-email'
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  htmlBody: { // Storing as HTML to allow for rich text, links, etc.
    type: String,
    required: true,
  },
  description: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);