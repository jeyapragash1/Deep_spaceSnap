const express = require('express');
const router = express.Router();

// Simple test route to ensure basic functionality works
router.get('/test', (req, res) => {
  res.json({ message: 'Quiz routes are working!' });
});

// Simplified questions route that just returns default questions
router.get('/questions', (req, res) => {
  try {
    const questions = [
      {
        id: 1,
        question: "How do you primarily use your living space?",
        type: "text",
        category: "usage",
        answers: [
          {
            id: "1a",
            text: "Relaxing/Resting",
            stylePoints: { scandinavian: 5 }
          },
          {
            id: "1b", 
            text: "Entertaining Guests",
            stylePoints: { modern: 5 }
          },
          {
            id: "1c",
            text: "Working/Studying", 
            stylePoints: { minimalist: 5 }
          },
          {
            id: "1d",
            text: "Family Time",
            stylePoints: { rustic: 5 }
          }
        ]
      },
      {
        id: 2,
        question: "What colors do you prefer in your home?",
        type: "text",
        category: "color",
        answers: [
          {
            id: "2a",
            text: "Neutral tones (Whites, Grays, Beiges)",
            stylePoints: { scandinavian: 5 }
          },
          {
            id: "2b",
            text: "Bold colors (Red, Yellow, Green)",
            stylePoints: { bohemian: 5 }
          },
          {
            id: "2c",
            text: "Earthy tones (Greens, Browns)",
            stylePoints: { rustic: 5 }
          },
          {
            id: "2d",
            text: "Pastels (Light Pink, Blue, Lavender)",
            stylePoints: { 'shabby-chic': 5 }
          }
        ]
      },
      {
        id: 3,
        question: "What type of furniture do you prefer?",
        type: "text", 
        category: "furniture",
        answers: [
          {
            id: "3a",
            text: "Modern, Clean lines, minimal design",
            stylePoints: { modern: 5 }
          },
          {
            id: "3b",
            text: "Vintage, Timeless and classic pieces",
            stylePoints: { rustic: 5 }
          },
          {
            id: "3c",
            text: "Industrial, Exposed metal and wood",
            stylePoints: { industrial: 5 }
          },
          {
            id: "3d",
            text: "Eclectic, A mix of different styles and eras",
            stylePoints: { bohemian: 5 }
          }
        ]
      },
      {
        id: 4,
        question: "Which of these best describes your preferred vibe?",
        type: "text",
        category: "vibe", 
        answers: [
          {
            id: "4a",
            text: "Cozy and inviting",
            stylePoints: { rustic: 5 }
          },
          {
            id: "4b",
            text: "Bright and open",
            stylePoints: { scandinavian: 5 }
          },
          {
            id: "4c",
            text: "Calm and serene",
            stylePoints: { minimalist: 5 }
          },
          {
            id: "4d",
            text: "Luxurious and sophisticated",
            stylePoints: { modern: 5 }
          }
        ]
      },
      {
        id: 5,
        question: "How much furniture do you want in your space?",
        type: "text",
        category: "amount",
        answers: [
          {
            id: "5a",
            text: "A few statement pieces",
            stylePoints: { minimalist: 5 }
          },
          {
            id: "5b",
            text: "Plenty of comfortable seating",
            stylePoints: { scandinavian: 5 }
          },
          {
            id: "5c",
            text: "A few high-end, luxurious pieces",
            stylePoints: { modern: 5 }
          },
          {
            id: "5d",
            text: "A mix of old and new furniture",
            stylePoints: { bohemian: 5 }
          }
        ]
      },
      {
        id: 6,
        question: "Which material do you prefer for your furniture and finishes?",
        type: "text",
        category: "material",
        answers: [
          {
            id: "6a",
            text: "Wood",
            stylePoints: { rustic: 5 }
          },
          {
            id: "6b",
            text: "Metal and Glass", 
            stylePoints: { industrial: 5 }
          },
          {
            id: "6c",
            text: "Fabric (upholstered)",
            stylePoints: { 'shabby-chic': 5 }
          },
          {
            id: "6d",
            text: "Leather and Polished Wood",
            stylePoints: { modern: 5 }
          }
        ]
      },
      {
        id: 7,
        question: "What type of lighting do you prefer?",
        type: "text",
        category: "lighting",
        answers: [
          {
            id: "7a",
            text: "Natural light with big windows",
            stylePoints: { scandinavian: 5 }
          },
          {
            id: "7b",
            text: "Bright and well-lit with lamps",
            stylePoints: { modern: 5 }
          },
          {
            id: "7c",
            text: "Soft, ambient lighting",
            stylePoints: { bohemian: 5 }
          },
          {
            id: "7d",
            text: "Moody, low-light atmosphere",
            stylePoints: { industrial: 5 }
          }
        ]
      }
    ];

    res.json({ questions });
  } catch (error) {
    console.error('Error in simple quiz route:', error);
    res.status(500).json({ message: 'Error loading quiz questions' });
  }
});

module.exports = router;