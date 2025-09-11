class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.isAvailable = !!this.apiKey;
  }

  async checkAvailability() {
    if (!this.apiKey) {
      return false;
    }
    return true;
  }

  async imageToBase64(imageElement) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      
      ctx.drawImage(imageElement, 0, 0);
      
      try {
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    });
  }

  async initialize() {
    return await this.checkAvailability();
  }

  async analyzeRoom(imageElement, customPrompt = '') {
    try {
      const isAvailable = await this.initialize();
      if (!isAvailable) {
        throw new Error('Gemini API key not configured');
      }

      const base64Image = await this.imageToBase64(imageElement);

      const prompt = `As an expert interior designer, analyze this room image and provide detailed styling suggestions.
      
      ${customPrompt ? `Special focus on: ${customPrompt}` : ''}
      
      Please analyze:
      1. Current room style and aesthetic
      2. Wall color recommendations with specific color names and hex codes
      3. Furniture placement and arrangement improvements
      4. Lighting suggestions and improvements
      5. Decorative elements and accessories recommendations
      6. Overall design coherence and flow
      
      Provide 5-7 specific, actionable recommendations that can be implemented to improve this space.`;

      const requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis generated';

      return {
        success: true,
        analysis: analysisText,
        suggestions: this.parseSuggestions(analysisText)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        analysis: null
      };
    }
  }

  async generateImagePrompt(analysis, roomStyle = '', aiStyle = '', customPrompt = '') {
    try {
      const isAvailable = await this.initialize();
      if (!isAvailable) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `Based on this interior design analysis, create a detailed prompt for an AI image generator:

      Analysis: ${analysis}
      
      Additional preferences:
      - Room Style: ${roomStyle || 'Modern'}
      - AI Style: ${aiStyle || 'Photorealistic'}
      - Custom Requirements: ${customPrompt || 'High quality professional interior design'}
      
      Create a single, detailed prompt that will generate a beautifully redesigned room that applies the analysis recommendations. Focus on:
      1. Specific colors mentioned in analysis
      2. Lighting improvements suggested
      3. Furniture arrangement changes
      4. Texture and material enhancements
      5. Overall aesthetic improvements
      
      Make the prompt detailed but concise (under 500 characters).`;

      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        }
      };

      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const generationPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Modern interior design transformation';
      
      return {
        success: true,
        generationPrompt: generationPrompt.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateCustomization(imageElement, changes) {
    try {
      const isAvailable = await this.initialize();
      if (!isAvailable) {
        throw new Error('Gemini API key not configured');
      }

      const base64Image = await this.imageToBase64(imageElement);
      const changesText = Object.entries(changes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      const prompt = `Based on this room image, generate a detailed description for an AI image generator to apply these changes: ${changesText}. 
      
      Create a prompt that:
      1. Maintains the room's structure and layout
      2. Applies the specified changes naturally
      3. Keeps lighting and perspective realistic
      4. Results in a cohesive, professionally designed space
      
      Format as a single, clear prompt for image generation.`;

      const requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        }
      };

      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const generationPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No prompt generated';
      
      return {
        success: true,
        generationPrompt: generationPrompt.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  parseSuggestions(analysisText) {
    const suggestions = {
      wallColors: [],
      furniture: [],
      lighting: [],
      general: []
    };

    const lines = analysisText.split('\n');
    let currentCategory = 'general';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('wall') && lowerLine.includes('color')) {
        currentCategory = 'wallColors';
      } else if (lowerLine.includes('furniture')) {
        currentCategory = 'furniture';
      } else if (lowerLine.includes('lighting')) {
        currentCategory = 'lighting';
      }

      if (line.trim() && !lowerLine.includes(':')) {
        suggestions[currentCategory].push(line.trim());
      }
    });

    return suggestions;
  }

  async generateImage(imageElement, prompt) {
    try {
      const isAvailable = await this.initialize();
      if (!isAvailable) {
        throw new Error('Gemini API key not configured');
      }

      const base64Image = await this.imageToBase64(imageElement);

      const editPrompt = `Edit this image: ${prompt}. Generate a new version of this room that applies the changes described.`;
      
      const requestBody = {
        contents: [{
          parts: [
            { text: editPrompt },
            {
              inline_data: {
                mime_type: "image/jpeg", 
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      };
      

      const response = await fetch(
        `${this.baseUrl}/gemini-2.5-flash-image-preview:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Nano Banana API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new Error('No candidate in response');
      }
      
      const parts = candidate.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          return {
            success: true,
            imageUrl: dataUrl
          };
        }
        
        if (part.inline_data && part.inline_data.data) {
          const mimeType = part.inline_data.mime_type || 'image/png';
          const dataUrl = `data:${mimeType};base64,${part.inline_data.data}`;
          return {
            success: true,
            imageUrl: dataUrl
          };
        }
        
        if (part.text && part.text.includes('http')) {
          const urlMatch = part.text.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            return {
              success: true,
              imageUrl: urlMatch[0]
            };
          }
        }
      }

      throw new Error('No image data found in response. Check console for full response.');
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cleanup() {
  }

  getFallbackMessage() {
    return {
      success: false,
      error: 'Gemini API key not configured. Please set REACT_APP_GEMINI_API_KEY in your environment variables.',
      fallbackSuggestion: 'Configure your API key to enable image analysis'
    };
  }
}

const geminiService = new GeminiService();
export default geminiService;