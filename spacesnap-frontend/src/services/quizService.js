import axios from 'axios';

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

const quizService = {
  // Get all quiz questions
  getQuestions: async () => {
    try {
      const response = await api.get('/questions');
      const data = response.data;
      
      // Convert relative image URLs to absolute URLs
      if (data.questions) {
        data.questions.forEach(question => {
          if (question.answers) {
            question.answers.forEach(answer => {
              if (answer.image && answer.image.startsWith('/api/images/')) {
                answer.image = `http://localhost:5000${answer.image}`;
              }
            });
          }
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
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
      
      // Convert styleRoomImages URLs
      if (data.styleRoomImages && Array.isArray(data.styleRoomImages)) {
        data.styleRoomImages = data.styleRoomImages.map(room => ({
          ...room,
          imageUrl: room.imageUrl.startsWith('/api/images/') 
            ? `http://localhost:5000${room.imageUrl}` 
            : room.imageUrl
        }));
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
      
      // Convert styleRoomImages URLs
      if (data.styleRoomImages && Array.isArray(data.styleRoomImages)) {
        data.styleRoomImages = data.styleRoomImages.map(room => ({
          ...room,
          imageUrl: room.imageUrl.startsWith('/api/images/') 
            ? `http://localhost:5000${room.imageUrl}` 
            : room.imageUrl
        }));
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