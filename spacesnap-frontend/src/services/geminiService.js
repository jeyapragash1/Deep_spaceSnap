import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAfIaAT7D4qEI2yb9E_OQ1HRTLWKhAEoDo';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

console.log('Initializing Gemini AI with API key:', GEMINI_API_KEY ? 'API key present' : 'No API key found');

const geminiService = {
  async testConnection() {
    try {
      console.log('Testing Gemini API connection...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hello, are you working?');
      const response = await result.response;
      const text = response.text();
      console.log('Gemini test response:', text);
      return { success: true, message: text };
    } catch (error) {
      console.error('Gemini test failed:', error);
      return { success: false, error: error.message };
    }
  },

  async generateDesignRecommendations(selectedImages) {
    try {
      console.log('Gemini service called with:', selectedImages);
      
      // Validate input
      if (!selectedImages || selectedImages.length === 0) {
        throw new Error('No selections provided for AI analysis');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Create detailed context from all user selections
      const selectionDetails = selectedImages
        .filter(selection => selection && selection.name) // Filter out invalid selections
        .map(selection => {
          const context = selection.questionText ? `${selection.questionText}: ${selection.name}` : selection.name;
          return context;
        }).join('\n- ');

      if (!selectionDetails.trim()) {
        throw new Error('No valid selections found for AI analysis');
      }

      console.log('Formatted selections for AI:', selectionDetails);
      
      const prompt = `As an expert interior designer AI, analyze these detailed user preferences from a style quiz:

User's Selections:
- ${selectionDetails}

IMPORTANT: Start your response with exactly this format:
**STYLE NAME:** [One specific style name like "Modern Minimalist" or "Bohemian Eclectic" etc.]

**STYLE DESCRIPTION:** [2-3 sentence description of why this style suits the user]

Then provide detailed sections:

**Design Style Analysis:**
- Identify the primary design style based on the selections
- Explain why this style matches the preferences
- Include what makes this style unique

**Color Palette Recommendations:**
- Suggest a comprehensive color scheme with specific color names/codes
- Include primary, secondary, and accent colors
- Explain how these colors work together psychologically

**Material and Texture Suggestions:**
- Recommend specific materials for floors, walls, furniture
- Suggest textures that complement the style
- Include fabric choices and finishes

**Furniture and Layout Ideas:**
- Suggest key furniture pieces with specific characteristics
- Recommend optimal room layouts and flow
- Include detailed lighting suggestions (ambient, task, accent)

**Room-Specific Applications:**
- Living Room: specific furniture, color schemes, decor
- Bedroom: bedding, furniture, ambiance
- Kitchen: cabinet styles, countertops, backsplashes
- Bathroom: fixtures, tiles, accessories

**Styling Tips and Accessories:**
- Decorative elements that enhance the style
- Specific art and accessories recommendations
- Plant suggestions and placement ideas

**Implementation Guide:**
- Step-by-step approach with priorities
- Budget-friendly alternatives with price ranges
- DIY vs professional recommendations
- Timeline suggestions

Make all recommendations specific, actionable, and highly personalized to create a cohesive design vision.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract style name and description from the response
      const styleNameMatch = text.match(/\*\*STYLE NAME:\*\*\s*(.+?)(?:\n|\*\*)/);
      const styleDescMatch = text.match(/\*\*STYLE DESCRIPTION:\*\*\s*(.+?)(?:\n\n|\*\*)/s);
      
      const styleName = styleNameMatch ? styleNameMatch[1].trim() : 'Your Unique Style';
      const styleDescription = styleDescMatch ? styleDescMatch[1].trim() : 'A personalized style based on your preferences.';

      return {
        styleName,
        styleDescription,
        recommendations: text,
        timestamp: new Date().toISOString(),
        selectedPreferences: selectionDetails
      };
    } catch (error) {
      console.error('Error generating Gemini recommendations:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw new Error(`Failed to generate design recommendations: ${error.message}`);
    }
  }
};

export default geminiService;