const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

// Debug route to test image fetching
router.get('/debug-images', async (req, res) => {
  try {
    console.log('🔍 Debug: Fetching quiz images...');
    
    const quizImages = await Image.find({ category: 'quiz-questions' });
    
    console.log(`Found ${quizImages.length} quiz images`);
    
    // Log first few images to see full structure
    quizImages.slice(0, 3).forEach(img => {
      console.log(`Image: ${img.name}`);
      console.log(`Full object:`, JSON.stringify(img, null, 2));
    });
    
    res.json({
      count: quizImages.length,
      images: quizImages.map(img => ({
        name: img.name,
        metadata: img.metadata,
        category: img.category,
        subcategory: img.subcategory,
        fullObject: img.toObject()
      }))
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple questions endpoint that just returns hardcoded data
router.get('/simple-questions', (req, res) => {
  const questions = [
    {
      id: 1,
      question: "Test question",
      type: "text",
      category: "test",
      answers: [
        { id: "1a", text: "Answer A", stylePoints: { modern: 5 } },
        { id: "1b", text: "Answer B", stylePoints: { rustic: 5 } }
      ]
    }
  ];
  
  res.json({ questions });
});

// Test the image processing logic step by step
router.get('/debug-questions', async (req, res) => {
  try {
    console.log('🔍 Step 1: Checking Quiz collection...');
    const Quiz = require('../models/Quiz');
    let quiz = await Quiz.findOne();
    console.log('Quiz found:', !!quiz);
    
    if (!quiz) {
      console.log('🔍 Step 2: Fetching quiz images...');
      const quizImages = await Image.find({ category: 'quiz-questions' }).select('name metadata');
      console.log(`Found ${quizImages.length} quiz images`);
      
      if (quizImages.length > 0) {
        console.log('🔍 Step 3: Processing images...');
        const questions = [];
        const questionMap = new Map();
        
        quizImages.forEach((img, index) => {
          console.log(`Processing image ${index + 1}: ${img.name}`);
          
          if (!img.metadata) {
            console.warn(`No metadata for ${img.name}`);
            return;
          }
          
          if (!img.metadata.questionNumber) {
            console.warn(`No questionNumber for ${img.name}`);
            return;
          }
          
          const qNum = img.metadata.questionNumber;
          console.log(`Question ${qNum} - Answer ${img.metadata.answerId}`);
          
          if (!questionMap.has(qNum)) {
            questionMap.set(qNum, {
              id: qNum,
              question: `Question ${qNum}`,
              type: "image",
              category: "test",
              answers: []
            });
          }
          
          questionMap.get(qNum).answers.push({
            id: img.metadata.answerId,
            image: `/api/images/${img.name}`,
            text: img.metadata.description,
            stylePoints: img.metadata.stylePoints
          });
        });
        
        console.log(`🔍 Step 4: Created ${questionMap.size} questions`);
        questionMap.forEach(q => questions.push(q));
        questions.sort((a, b) => a.id - b.id);
        
        console.log(`🔍 Step 5: Returning ${questions.length} questions`);
        return res.json({ questions, debug: true });
      }
    }
    
    res.json({ questions: [], message: "No questions found" });
    
  } catch (error) {
    console.error('Debug questions error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;