const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Style = require('../models/Style');
const QuizResult = require('../models/QuizResult');
const authMiddleware = require('../middleware/authMiddleware');
const Image = require('../models/Image');

// Helper function to get default questions
function getDefaultQuestions() {
  return [
    {
      id: 1,
      question: "Which of these rooms feels most like a place you'd love to relax in?",
      type: "image",
      category: "ambiance",
      answers: [
        {
          id: "1a",
          image: "http://localhost:5000/api/images/room-modern",
          stylePoints: { modern: 3, minimalist: 2, industrial: 1 }
        },
        {
          id: "1b",
          image: "http://localhost:5000/api/images/room-bohemian",
          stylePoints: { bohemian: 3, eclectic: 2, maximalist: 1 }
        },
        {
          id: "1c",
          image: "http://localhost:5000/api/images/room-traditional",
          stylePoints: { traditional: 3, transitional: 2, classical: 1 }
        },
        {
          id: "1d",
          image: "http://localhost:5000/api/images/room-scandinavian",
          stylePoints: { scandinavian: 3, minimalist: 2, modern: 1 }
        }
      ]
    },
    {
      id: 2,
      question: "Which color palette are you most drawn to?",
      type: "image",
      category: "color",
      answers: [
        {
          id: "2a",
          image: "http://localhost:5000/api/images/palette-neutral",
          stylePoints: { minimalist: 3, scandinavian: 2, modern: 1 }
        },
        {
          id: "2b",
          image: "http://localhost:5000/api/images/palette-warm",
          stylePoints: { bohemian: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "2c",
          image: "http://localhost:5000/api/images/palette-cool",
          stylePoints: { modern: 3, industrial: 2, minimalist: 1 }
        },
        {
          id: "2d",
          image: "http://localhost:5000/api/images/palette-vibrant",
          stylePoints: { eclectic: 3, maximalist: 2, bohemian: 1 }
        }
      ]
    },
    {
      id: 3,
      question: "Pick the texture that appeals to you most.",
      type: "image",
      category: "texture",
      answers: [
        {
          id: "3a",
          image: "http://localhost:5000/api/images/texture-smooth",
          stylePoints: { modern: 3, minimalist: 2, industrial: 1 }
        },
        {
          id: "3b",
          image: "http://localhost:5000/api/images/texture-natural",
          stylePoints: { scandinavian: 3, bohemian: 2, traditional: 1 }
        },
        {
          id: "3c",
          image: "http://localhost:5000/api/images/texture-luxurious",
          stylePoints: { classical: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "3d",
          image: "http://localhost:5000/api/images/texture-mixed",
          stylePoints: { eclectic: 3, maximalist: 2, bohemian: 1 }
        }
      ]
    },
    {
      id: 4,
      question: "Which piece of art would you hang on your wall?",
      type: "image",
      category: "art",
      answers: [
        {
          id: "4a",
          image: "http://localhost:5000/api/images/art-abstract",
          stylePoints: { modern: 3, minimalist: 2, industrial: 1 }
        },
        {
          id: "4b",
          image: "http://localhost:5000/api/images/art-nature",
          stylePoints: { bohemian: 3, scandinavian: 2, traditional: 1 }
        },
        {
          id: "4c",
          image: "http://localhost:5000/api/images/art-classical",
          stylePoints: { classical: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "4d",
          image: "http://localhost:5000/api/images/art-eclectic",
          stylePoints: { eclectic: 3, maximalist: 2, bohemian: 1 }
        }
      ]
    },
    {
      id: 5,
      question: "Which piece of furniture best fits your style?",
      type: "image",
      category: "furniture",
      answers: [
        {
          id: "5a",
          image: "http://localhost:5000/api/images/furniture-modern",
          stylePoints: { modern: 3, minimalist: 2, industrial: 1 }
        },
        {
          id: "5b",
          image: "http://localhost:5000/api/images/furniture-vintage",
          stylePoints: { bohemian: 3, eclectic: 2, traditional: 1 }
        },
        {
          id: "5c",
          image: "http://localhost:5000/api/images/furniture-classic",
          stylePoints: { classical: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "5d",
          image: "http://localhost:5000/api/images/furniture-scandinavian",
          stylePoints: { scandinavian: 3, minimalist: 2, modern: 1 }
        }
      ]
    },
    {
      id: 6,
      question: "How do you prefer your lighting?",
      type: "text",
      category: "lighting",
      answers: [
        {
          id: "6a",
          text: "Bright and energizing",
          stylePoints: { modern: 3, minimalist: 2, scandinavian: 1 }
        },
        {
          id: "6b",
          text: "Warm and cozy",
          stylePoints: { bohemian: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "6c",
          text: "Dramatic and moody",
          stylePoints: { industrial: 3, maximalist: 2, eclectic: 1 }
        },
        {
          id: "6d",
          text: "Natural and soft",
          stylePoints: { scandinavian: 3, minimalist: 2, bohemian: 1 }
        }
      ]
    },
    {
      id: 7,
      question: "Finally, which word best describes your ideal space?",
      type: "text",
      category: "overall",
      answers: [
        {
          id: "7a",
          text: "Serene",
          stylePoints: { minimalist: 3, scandinavian: 2, modern: 1 }
        },
        {
          id: "7b",
          text: "Vibrant",
          stylePoints: { bohemian: 3, eclectic: 2, maximalist: 1 }
        },
        {
          id: "7c",
          text: "Sophisticated",
          stylePoints: { classical: 3, traditional: 2, transitional: 1 }
        },
        {
          id: "7d",
          text: "Edgy",
          stylePoints: { industrial: 3, modern: 2, eclectic: 1 }
        }
      ]
    }
  ];
}

// GET /quiz/questions - Get all quiz questions
router.get('/questions', async (req, res) => {
  try {
    console.log('📊 Constructing quiz from uploaded images...');
    
    // Get quiz question images from database
    const quizImages = await Image.find({ category: 'quiz-questions' });
    console.log(`Found ${quizImages.length} quiz images`);
    
    if (quizImages.length > 0) {
      // Construct questions from uploaded images
      const questions = [];
      const questionMap = new Map();
      
      // Group images by question number
      quizImages.forEach(img => {
        // Skip if metadata is missing
        if (!img.metadata || !img.metadata.questionNumber) {
          console.warn(`Skipping image ${img.name} - missing metadata`);
          return;
        }
        
        const qNum = img.metadata.questionNumber;
        console.log(`Processing Q${qNum} - ${img.metadata.answerId}: ${img.metadata.description}`);
        
        if (!questionMap.has(qNum)) {
          questionMap.set(qNum, {
            id: qNum,
            question: getQuestionText(qNum),
            type: "image",
            category: getQuestionCategory(qNum),
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
      
      // Convert map to array and sort by question number
      questionMap.forEach(q => questions.push(q));
      questions.sort((a, b) => a.id - b.id);
      
      console.log(`✅ Created ${questions.length} questions from images`);
      
      if (questions.length > 0) {
        return res.json({ questions });
      }
    }
    
    // If we get here, there's an issue with the image processing
    console.error('❌ Failed to create questions from images');
    return res.status(500).json({ 
      message: 'No quiz questions available', 
      debug: 'Images found but failed to process' 
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz questions', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /quiz/submit - Submit quiz answers and get results
router.post('/submit', async (req, res) => {
  try {
    const { answers, sessionId } = req.body;
    
    // Calculate style scores
    const styleScores = {};
    let selectedArt = null;
    let selectedFurniture = null;
    
    // Get quiz questions to calculate scores
    const quiz = await Quiz.findOne();
    const questions = quiz ? quiz.questions : getDefaultQuestions();
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const selectedAnswer = question.answers.find(a => a.id === answer.answerId);
        if (selectedAnswer && selectedAnswer.stylePoints) {
          // Add style points
          for (const [style, points] of Object.entries(selectedAnswer.stylePoints)) {
            styleScores[style] = (styleScores[style] || 0) + points;
          }
          
          // Track art and furniture selections
          if (question.category === 'art') {
            selectedArt = { id: selectedAnswer.id, image: selectedAnswer.image };
          } else if (question.category === 'furniture') {
            selectedFurniture = { id: selectedAnswer.id, image: selectedAnswer.image };
          }
        }
      }
    });
    
    // Find the recommended style (highest score)
    let recommendedStyle = 'modern'; // default
    let highestScore = 0;
    
    for (const [style, score] of Object.entries(styleScores)) {
      if (score > highestScore) {
        highestScore = score;
        recommendedStyle = style;
      }
    }
    
    // Map missing styles to existing styles with images
    const styleMappings = {
      'traditional': 'rustic',      // Traditional → Rustic (both classic, warm)
      'classical': 'rustic',        // Classical → Rustic (both timeless, elegant)  
      'eclectic': 'bohemian',       // Eclectic → Bohemian (both mix styles)
      'transitional': 'modern',     // Transitional → Modern (blend of traditional/contemporary)
      'maximalist': 'bohemian'      // Maximalist → Bohemian (both embrace abundance)
    };
    
    // Get the style to use for images (mapped if necessary)
    const imageStyle = styleMappings[recommendedStyle.toLowerCase()] || recommendedStyle.toLowerCase();
    
    // Get style room images for the recommended style (or mapped style)
    const styleRoomImages = await Image.find({
      category: 'style-rooms',
      subcategory: imageStyle
    }).select('name metadata');
    
    const roomImages = styleRoomImages.map(img => ({
      roomType: img.metadata.roomType,
      imageUrl: `/api/images/${img.name}`,
      imageName: img.name
    }));
    
    // Save quiz result
    const quizResult = new QuizResult({
      user: req.user ? req.user._id : null,
      sessionId: sessionId || Date.now().toString(),
      answers,
      selectedArt,
      selectedFurniture,
      recommendedStyle,
      styleScores,
      styleRoomImages: roomImages
    });
    
    await quizResult.save();
    
    // Get style details
    let styleDetails = await Style.findOne({ id: recommendedStyle });
    
    // If style not in DB, use default data
    if (!styleDetails) {
      styleDetails = getDefaultStyleDetails(recommendedStyle);
    }
    
    res.json({
      resultId: quizResult._id,
      recommendedStyle,
      styleDetails,
      selectedArt,
      selectedFurniture,
      styleScores,
      styleRoomImages: roomImages
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error processing quiz submission' });
  }
});

// GET /quiz/results/:id - Get quiz results by ID
router.get('/results/:id', async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    
    // Get style details
    let styleDetails = await Style.findOne({ id: result.recommendedStyle });
    
    // If style not in DB, use default data
    if (!styleDetails) {
      styleDetails = getDefaultStyleDetails(result.recommendedStyle);
    }
    
    res.json({
      resultId: result._id,
      recommendedStyle: result.recommendedStyle,
      styleDetails,
      selectedArt: result.selectedArt,
      selectedFurniture: result.selectedFurniture,
      styleScores: result.styleScores,
      styleRoomImages: result.styleRoomImages || [],
      createdAt: result.createdAt
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ message: 'Error fetching quiz result' });
  }
});

// Helper function to get default style details
function getDefaultStyleDetails(styleId) {
  const styles = {
    modern: {
      id: "modern",
      name: "Modern",
      description: "Clean lines, neutral colors, and functional design characterize the modern style.",
      characteristics: ["Minimalist", "Functional", "Clean lines", "Neutral colors"],
      colorPalette: ["#000000", "#FFFFFF", "#808080", "#C0C0C0"],
      keyElements: ["Glass", "Steel", "Concrete", "Simple furniture"],
      image: "http://localhost:5000/api/images/modern"
    },
    minimalist: {
      id: "minimalist",
      name: "Minimalist",
      description: "Less is more. Focus on essential elements with plenty of space and light.",
      characteristics: ["Simple", "Uncluttered", "Functional", "Neutral palette"],
      colorPalette: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#333333"],
      keyElements: ["Open space", "Natural light", "Simple forms", "Hidden storage"],
      image: "http://localhost:5000/api/images/minimalist"
    },
    bohemian: {
      id: "bohemian",
      name: "Bohemian",
      description: "Eclectic, colorful, and full of life. Mix patterns, textures, and cultural elements.",
      characteristics: ["Eclectic", "Colorful", "Textured", "Personal"],
      colorPalette: ["#B8860B", "#8B4513", "#FF6347", "#4682B4"],
      keyElements: ["Textiles", "Plants", "Vintage items", "Global decor"],
      image: "http://localhost:5000/api/images/bohemian"
    },
    scandinavian: {
      id: "scandinavian",
      name: "Scandinavian",
      description: "Cozy minimalism with natural materials, light colors, and functional design.",
      characteristics: ["Hygge", "Natural", "Light", "Functional"],
      colorPalette: ["#FFFFFF", "#F0F0F0", "#D2B48C", "#8B7355"],
      keyElements: ["Wood", "Wool", "Natural light", "Simple furniture"],
      image: "http://localhost:5000/api/images/scandinavian"
    },
    industrial: {
      id: "industrial",
      name: "Industrial",
      description: "Raw, unfinished look with exposed elements and urban warehouse feel.",
      characteristics: ["Raw", "Urban", "Exposed elements", "Dark tones"],
      colorPalette: ["#2F4F4F", "#696969", "#8B4513", "#CD853F"],
      keyElements: ["Metal", "Brick", "Concrete", "Edison bulbs"],
      image: "http://localhost:5000/api/images/industrial"
    },
    traditional: {
      id: "traditional",
      name: "Traditional",
      description: "Classic, timeless design with rich colors, elegant furniture, and refined details.",
      characteristics: ["Classic", "Elegant", "Warm", "Detailed"],
      colorPalette: ["#8B4513", "#A0522D", "#D2691E", "#F5DEB3"],
      keyElements: ["Wood furniture", "Crown molding", "Classic patterns", "Warm lighting"],
      image: "http://localhost:5000/api/images/traditional"
    },
    transitional: {
      id: "transitional",
      name: "Transitional",
      description: "Perfect blend of traditional and contemporary styles for a balanced look.",
      characteristics: ["Balanced", "Neutral", "Comfortable", "Sophisticated"],
      colorPalette: ["#F5F5DC", "#D3D3D3", "#A9A9A9", "#696969"],
      keyElements: ["Mixed materials", "Neutral colors", "Clean lines", "Comfort"],
      image: "http://localhost:5000/api/images/transitional"
    },
    eclectic: {
      id: "eclectic",
      name: "Eclectic",
      description: "Mix and match different styles, periods, and cultures for a unique personal space.",
      characteristics: ["Mixed", "Personal", "Creative", "Unexpected"],
      colorPalette: ["#FF6347", "#4682B4", "#FFD700", "#9370DB"],
      keyElements: ["Mix of styles", "Bold colors", "Unique pieces", "Personal items"],
      image: "http://localhost:5000/api/images/eclectic"
    },
    classical: {
      id: "classical",
      name: "Classical",
      description: "Inspired by Greek and Roman design with symmetry, columns, and ornate details.",
      characteristics: ["Symmetrical", "Ornate", "Grand", "Timeless"],
      colorPalette: ["#F5F5DC", "#FFE4B5", "#F0E68C", "#BDB76B"],
      keyElements: ["Columns", "Moldings", "Symmetry", "Rich fabrics"],
      image: "http://localhost:5000/api/images/classical"
    },
    maximalist: {
      id: "maximalist",
      name: "Maximalist",
      description: "More is more! Bold patterns, rich colors, and layers of decor create visual interest.",
      characteristics: ["Bold", "Layered", "Colorful", "Dramatic"],
      colorPalette: ["#FF1493", "#00CED1", "#FFD700", "#8A2BE2"],
      keyElements: ["Patterns", "Colors", "Art", "Collections"],
      image: "http://localhost:5000/api/images/maximalist"
    }
  };
  
  return styles[styleId] || styles.modern;
}

// Helper function to get question text based on question number
function getQuestionText(questionNumber) {
  const questionTexts = {
    1: "How do you primarily use your living space?",
    2: "What colors do you prefer in your home?",
    3: "What type of furniture do you prefer?",
    4: "Which of these best describes your preferred vibe?",
    5: "How much furniture do you want in your space?",
    6: "Which material do you prefer for your furniture and finishes?",
    7: "What type of lighting do you prefer?"
  };
  return questionTexts[questionNumber] || `Question ${questionNumber}`;
}

// Helper function to get question category based on question number
function getQuestionCategory(questionNumber) {
  const categories = {
    1: "ambiance",
    2: "color",
    3: "furniture",
    4: "vibe",
    5: "furniture-amount",
    6: "material",
    7: "lighting"
  };
  return categories[questionNumber] || "general";
}

module.exports = router;