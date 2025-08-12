// spacesnap-backend/utils/aiImageService.js

const fetch = require('node-fetch');

class AIImageService {
  constructor() {
    this.apiKey = process.env.LAOZHANG_API_KEY;
    this.apiUrl = process.env.LAOZHANG_API_URL;
    
    if (!this.apiKey || !this.apiUrl) {
      console.error('LaoZhang.ai API configuration missing from environment variables');
    }
  }

  async testConnection() {
    try {
      console.log('Testing LaoZhang API connection...');
      console.log('API URL:', this.apiUrl);
      console.log('API Key (first 10 chars):', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'Not found');
      
      const testResult = await this.generateImage('scandinavian minimalist living room');
      console.log('API test successful:', testResult);
      return { success: true, result: testResult };
    } catch (error) {
      console.error('API test failed:', error);
      
      let errorInfo = error.message;
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorInfo = 'Authentication failed - API key may be invalid';
      } else if (error.message.includes('429')) {
        errorInfo = 'Rate limit exceeded - too many requests';
      } else if (error.message.includes('CORS')) {
        errorInfo = 'CORS error - API blocking browser requests';
      } else if (error.message.includes('403')) {
        errorInfo = 'Access forbidden - Check API permissions';
      }
      
      return { success: false, error: errorInfo, fullError: error.message };
    }
  }

  async generateStyleImages(styleName, styleDescription, geminiRecommendations) {
    try {
      console.log('Generating single comprehensive image for style:', styleName);
      
      const comprehensivePrompt = this.createComprehensivePrompt(styleName, styleDescription, geminiRecommendations);
      
      const result = await this.generateImage(comprehensivePrompt);
      
      // FIX: Used backticks (`) for template literals
      const generatedImage = {
        id: 1,
        prompt: comprehensivePrompt,
        imageUrl: result.output_url,
        title: `${styleName} Design Collection`,
        description: `Complete ${styleName} style interior design showcase`
      };
      
      console.log('Successfully generated comprehensive design image');
      return [generatedImage];
      
    } catch (error) {
      console.error('Error generating style image:', error);
      throw new Error('Failed to generate style image');
    }
  }

  async generateImage(prompt) {
    try {
      console.log('Generating image with prompt:', prompt);
      console.log('Using LaoZhang API');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Used backticks (`) for the Authorization header
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "sora_image",
          stream: false,
          messages: [
            { role: "system", content: "You are a helpful assistant that generates interior design images." },
            { role: "user", content: prompt }
          ]
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LaoZhang API error response:', errorText);
        // FIX: Used backticks (`) for the Error message
        throw new Error(`LaoZhang API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      const imageContent = data?.choices?.[0]?.message?.content;
      
      if (!imageContent) {
        throw new Error('No image content returned from LaoZhang API');
      }
      
      let imageUrl = imageContent.trim();
      
      const markdownImageMatch = imageContent.match(/!\[.?\]\((.?)\)/);
      if (markdownImageMatch) {
        imageUrl = markdownImageMatch[1].trim();
      }
      
      const urlMatch = imageContent.match(/(https?:\/\/[^\s\)]+)/);
      if (urlMatch) {
        imageUrl = urlMatch[1].trim();
      }
      
      imageUrl = imageUrl.replace(/[\)\]"'`]*$/, '');
      
      console.log('Extracted and cleaned image URL:', imageUrl);
      
      return { output_url: imageUrl, full_response: data };
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        stack: error.stack,
        prompt: prompt
      });
      throw error;
    }
  }

  createComprehensivePrompt(styleName, styleDescription, geminiRecommendations) {
    const cleanStyleName = styleName ? styleName.toLowerCase().replace(/[^a-z0-9\s]/g, '') : 'modern';
    
    let recommendationsText = '';
    if (geminiRecommendations) {
      if (typeof geminiRecommendations === 'string') {
        recommendationsText = geminiRecommendations;
      } else if (typeof geminiRecommendations === 'object' && geminiRecommendations.recommendations) {
        recommendationsText = geminiRecommendations.recommendations;
      } else {
        recommendationsText = JSON.stringify(geminiRecommendations);
      }
    }
    
    const textToAnalyze = recommendationsText || styleDescription || '';
    
    const colorInfo = this.extractColorPalette(textToAnalyze);
    const materialInfo = this.extractMaterials(textToAnalyze);
    
    // FIX: Used backticks (`) to create the prompt string
    const shortPrompt = `${cleanStyleName} interior design showcase, ${colorInfo}, ${materialInfo}, cohesive style`;
    
    console.log('Generated comprehensive prompt:', shortPrompt);
    console.log('Prompt length:', shortPrompt.length);
    return shortPrompt;
  }

  extractColorPalette(recommendations) {
    const recText = typeof recommendations === 'string' ? recommendations : '';
    
    if (!recText.trim()) {
      return 'neutral colors';
    }
    
    const colorKeywords = ['color', 'palette', 'neutral', 'warm', 'cool', 'white', 'gray', 'beige', 'earth tones'];
    const lines = recText.toLowerCase().split('\n');
    
    const colorLine = lines.find(line => 
      colorKeywords.some(keyword => line.includes(keyword))
    );
    
    if (colorLine) {
      return colorLine.substring(0, 20).trim() || 'neutral colors';
    }
    
    return 'neutral colors';
  }

  extractMaterials(recommendations) {
    const recText = typeof recommendations === 'string' ? recommendations : '';
    
    if (!recText.trim()) {
      return 'natural materials';
    }
    
    const materialKeywords = ['material', 'wood', 'metal', 'fabric', 'texture', 'stone', 'glass'];
    const lines = recText.toLowerCase().split('\n');
    
    const materialLine = lines.find(line => 
      materialKeywords.some(keyword => line.includes(keyword))
    );
    
    if (materialLine) {
      return materialLine.substring(0, 20).trim() || 'natural materials';
    }
    
    return 'natural materials';
  }
}

module.exports = new AIImageService();