const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  answers: [{
    questionId: Number,
    answerId: String
  }],
  selectedArt: {
    id: String,
    image: String
  },
  selectedFurniture: {
    id: String,
    image: String
  },
  recommendedStyle: {
    type: String,
    required: true
  },
  styleRoomImages: [{
    roomType: String,
    imageUrl: String,
    imageName: String
  }],
  styleScores: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);