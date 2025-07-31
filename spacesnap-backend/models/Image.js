const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quiz', 'style', 'general', 'quiz-questions', 'style-rooms']
  },
  subcategory: {
    type: String,
    enum: ['room', 'palette', 'texture', 'art', 'furniture', 'lighting', 'bohemian', 'industrial', 'rustic', 'scandinavian', 'shabby-chic', 'minimalist', 'modern']
  },
  description: String,
  data: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  },
  size: {
    type: Number,
    required: true
  },
  width: Number,
  height: Number,
  tags: [String],
  metadata: {
    questionNumber: Number,
    answerId: String,
    description: String,
    stylePoints: mongoose.Schema.Types.Mixed,
    style: String,
    roomType: String,
    originalName: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
ImageSchema.index({ category: 1, subcategory: 1 });
ImageSchema.index({ name: 1 });

// Pre-save middleware to update the updatedAt field
ImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Image', ImageSchema);