const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: String,
  image: String,
  stylePoints: {
    type: Map,
    of: Number
  }
});

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'text'],
    required: true
  },
  category: String,
  answers: [answerSchema]
});

const QuizSchema = new mongoose.Schema({
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);