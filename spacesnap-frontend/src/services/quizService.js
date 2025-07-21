import axios from 'axios';
import { getLocalImageForAnswer } from '../utils/localImageMappings';

const API_URL = 'http://localhost:5000/api/quiz';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Default questions with local images for fallback
const getDefaultQuestionsWithLocalImages = () => {
  return [
    {
      id: 'q1',
      question: 'Which room style appeals to you most?',
      type: 'image',
      questionType: 'style_preference',
      answers: [
        { id: 'modern', text: 'Modern', image: '/quiz/room-modern.svg', value: 'modern' },
        { id: 'bohemian', text: 'Bohemian', image: '/quiz/room-bohemian.svg', value: 'bohemian' },
        { id: 'traditional', text: 'Traditional', image: '/quiz/room-traditional.svg', value: 'traditional' },
        { id: 'scandinavian', text: 'Scandinavian', image: '/quiz/room-scandinavian.svg', value: 'scandinavian' }
      ]
    },
    {
      id: 'q2',
      question: 'What color palette do you prefer?',
      type: 'image',
      questionType: 'color_palette',
      answers: [
        { id: 'neutral', text: 'Neutral', image: '/quiz/palette-neutral.svg', value: 'neutral' },
        { id: 'warm', text: 'Warm', image: '/quiz/palette-warm.svg', value: 'warm' },
        { id: 'cool', text: 'Cool', image: '/quiz/palette-cool.svg', value: 'cool' },
        { id: 'vibrant', text: 'Vibrant', image: '/quiz/palette-vibrant.svg', value: 'vibrant' }
      ]
    },
    {
      id: 'q3',
      question: 'What texture do you prefer?',
      type: 'image',
      questionType: 'texture_preference',
      answers: [
        { id: 'smooth', text: 'Smooth & Sleek', image: '/quiz/texture-smooth.svg', value: 'smooth' },
        { id: 'natural', text: 'Natural & Organic', image: '/quiz/texture-natural.svg', value: 'natural' },
        { id: 'mixed', text: 'Mixed Textures', image: '/quiz/texture-mixed.svg', value: 'mixed' },
        { id: 'luxurious', text: 'Luxurious & Plush', image: '/quiz/texture-luxurious.svg', value: 'luxurious' }
      ]
    },
    {
      id: 'q4',
      question: 'What art style do you prefer?',
      type: 'image',
      questionType: 'art_preference',
      answers: [
        { id: 'nature', text: 'Nature & Landscapes', image: '/quiz/art-nature.svg', value: 'nature' },
        { id: 'abstract', text: 'Abstract & Modern', image: '/quiz/art-abstract.svg', value: 'abstract' },
        { id: 'classical', text: 'Classical & Traditional', image: '/quiz/art-classical.svg', value: 'classical' },
        { id: 'eclectic', text: 'Eclectic & Mixed', image: '/quiz/art-eclectic.svg', value: 'eclectic' }
      ]
    },
    {
      id: 'q5',
      question: 'What furniture style do you prefer?',
      type: 'image',
      questionType: 'furniture_preference',
      answers: [
        { id: 'modern', text: 'Modern & Minimal', image: '/quiz/furniture-modern.svg', value: 'modern' },
        { id: 'vintage', text: 'Vintage & Antique', image: '/quiz/furniture-vintage.svg', value: 'vintage' },
        { id: 'classic', text: 'Classic & Traditional', image: '/quiz/furniture-classic.svg', value: 'classic' },
        { id: 'scandinavian', text: 'Scandinavian & Simple', image: '/quiz/furniture-scandinavian.svg', value: 'scandinavian' }
      ]
    }
  ];
};

const quizService = {
  // Get all quiz questions
  getQuestions: async () => {
    try {
      const response = await api.get('/questions');
      const data = response.data;
      
      // Apply fallback logic for images
      if (data.questions) {
        data.questions.forEach(question => {
          if (question.answers && question.type === 'image') {
            question.answers.forEach(answer => {
              // First priority: DB image
              if (answer.image) {
                if (answer.image.startsWith('/api/images/')) {
                  answer.image = `http://localhost:5000${answer.image}`;
                }
                // Check if image exists by trying to load it
                const img = new Image();
                img.onerror = () => {
                  // If DB image fails, try local image
                  const localImage = getLocalImageForAnswer(question.questionType || question.id, answer.id || answer.value);
                  if (localImage) {
                    answer.image = localImage;
                    answer.fallbackToLocal = true;
                  } else {
                    // If no local image, mark for name-only display
                    answer.image = null;
                    answer.nameOnly = true;
                  }
                };
                img.src = answer.image;
              } else {
                // No DB image, try local fallback
                const localImage = getLocalImageForAnswer(question.questionType || question.id, answer.id || answer.value);
                if (localImage) {
                  answer.image = localImage;
                  answer.fallbackToLocal = true;
                } else {
                  // No images available, mark for name-only display
                  answer.nameOnly = true;
                }
              }
            });
          }
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      // If API fails, return questions with local images only
      return {
        questions: getDefaultQuestionsWithLocalImages()
      };
    }
  },

  // Submit quiz answers and get results
  submitQuiz: async (answers, sessionId = null) => {
    try {
      const response = await api.post('/submit', {
        answers,
        sessionId: sessionId || Date.now().toString(),
      });
      const data = response.data;
      
      // Convert relative image URLs to absolute URLs in results
      if (data.selectedArt && data.selectedArt.image && data.selectedArt.image.startsWith('/api/images/')) {
        data.selectedArt.image = `http://localhost:5000${data.selectedArt.image}`;
      }
      if (data.selectedFurniture && data.selectedFurniture.image && data.selectedFurniture.image.startsWith('/api/images/')) {
        data.selectedFurniture.image = `http://localhost:5000${data.selectedFurniture.image}`;
      }
      if (data.styleDetails && data.styleDetails.image && data.styleDetails.image.startsWith('/api/images/')) {
        data.styleDetails.image = `http://localhost:5000${data.styleDetails.image}`;
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  // Get quiz results by ID
  getResults: async (resultId) => {
    try {
      const response = await api.get(`/results/${resultId}`);
      const data = response.data;
      
      // Convert relative image URLs to absolute URLs in results
      if (data.selectedArt && data.selectedArt.image && data.selectedArt.image.startsWith('/api/images/')) {
        data.selectedArt.image = `http://localhost:5000${data.selectedArt.image}`;
      }
      if (data.selectedFurniture && data.selectedFurniture.image && data.selectedFurniture.image.startsWith('/api/images/')) {
        data.selectedFurniture.image = `http://localhost:5000${data.selectedFurniture.image}`;
      }
      if (data.styleDetails && data.styleDetails.image && data.styleDetails.image.startsWith('/api/images/')) {
        data.styleDetails.image = `http://localhost:5000${data.styleDetails.image}`;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  },

  // Helper function to get style details
  getStyleDetails: (styleId) => {
    const styles = {
      modern: {
        id: "modern",
        name: "Modern",
        description: "Clean lines, neutral colors, and functional design characterize the modern style.",
        characteristics: ["Minimalist", "Functional", "Clean lines", "Neutral colors"],
        colorPalette: ["#000000", "#FFFFFF", "#808080", "#C0C0C0"],
        keyElements: ["Glass", "Steel", "Concrete", "Simple furniture"],
      },
      minimalist: {
        id: "minimalist",
        name: "Minimalist",
        description: "Less is more. Focus on essential elements with plenty of space and light.",
        characteristics: ["Simple", "Uncluttered", "Functional", "Neutral palette"],
        colorPalette: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#333333"],
        keyElements: ["Open space", "Natural light", "Simple forms", "Hidden storage"],
      },
      bohemian: {
        id: "bohemian",
        name: "Bohemian",
        description: "Eclectic, colorful, and full of life. Mix patterns, textures, and cultural elements.",
        characteristics: ["Eclectic", "Colorful", "Textured", "Personal"],
        colorPalette: ["#B8860B", "#8B4513", "#FF6347", "#4682B4"],
        keyElements: ["Textiles", "Plants", "Vintage items", "Global decor"],
      },
      scandinavian: {
        id: "scandinavian",
        name: "Scandinavian",
        description: "Cozy minimalism with natural materials, light colors, and functional design.",
        characteristics: ["Hygge", "Natural", "Light", "Functional"],
        colorPalette: ["#FFFFFF", "#F0F0F0", "#D2B48C", "#8B7355"],
        keyElements: ["Wood", "Wool", "Natural light", "Simple furniture"],
      },
      industrial: {
        id: "industrial",
        name: "Industrial",
        description: "Raw, unfinished look with exposed elements and urban warehouse feel.",
        characteristics: ["Raw", "Urban", "Exposed elements", "Dark tones"],
        colorPalette: ["#2F4F4F", "#696969", "#8B4513", "#CD853F"],
        keyElements: ["Metal", "Brick", "Concrete", "Edison bulbs"],
      },
      traditional: {
        id: "traditional",
        name: "Traditional",
        description: "Classic, timeless design with rich colors, elegant furniture, and refined details.",
        characteristics: ["Classic", "Elegant", "Warm", "Detailed"],
        colorPalette: ["#8B4513", "#A0522D", "#D2691E", "#F5DEB3"],
        keyElements: ["Wood furniture", "Crown molding", "Classic patterns", "Warm lighting"],
      },
      transitional: {
        id: "transitional",
        name: "Transitional",
        description: "Perfect blend of traditional and contemporary styles for a balanced look.",
        characteristics: ["Balanced", "Neutral", "Comfortable", "Sophisticated"],
        colorPalette: ["#F5F5DC", "#D3D3D3", "#A9A9A9", "#696969"],
        keyElements: ["Mixed materials", "Neutral colors", "Clean lines", "Comfort"],
      },
      eclectic: {
        id: "eclectic",
        name: "Eclectic",
        description: "Mix and match different styles, periods, and cultures for a unique personal space.",
        characteristics: ["Mixed", "Personal", "Creative", "Unexpected"],
        colorPalette: ["#FF6347", "#4682B4", "#FFD700", "#9370DB"],
        keyElements: ["Mix of styles", "Bold colors", "Unique pieces", "Personal items"],
      },
      classical: {
        id: "classical",
        name: "Classical",
        description: "Inspired by Greek and Roman design with symmetry, columns, and ornate details.",
        characteristics: ["Symmetrical", "Ornate", "Grand", "Timeless"],
        colorPalette: ["#F5F5DC", "#FFE4B5", "#F0E68C", "#BDB76B"],
        keyElements: ["Columns", "Moldings", "Symmetry", "Rich fabrics"],
      },
      maximalist: {
        id: "maximalist",
        name: "Maximalist",
        description: "More is more! Bold patterns, rich colors, and layers of decor create visual interest.",
        characteristics: ["Bold", "Layered", "Colorful", "Dramatic"],
        colorPalette: ["#FF1493", "#00CED1", "#FFD700", "#8A2BE2"],
        keyElements: ["Patterns", "Colors", "Art", "Collections"],
      },
    };
    return styles[styleId] || styles.modern;
  },
};

export default quizService;