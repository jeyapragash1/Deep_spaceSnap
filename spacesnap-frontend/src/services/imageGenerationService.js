// Backend API configuration
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AI_ENDPOINTS = {
  TEST: `${BACKEND_API_URL}/api/images/ai/test`,
  GENERATE: `${BACKEND_API_URL}/api/images/ai/generate`,
  PROXY: `${BACKEND_API_URL}/api/images/ai/proxy`
};

const imageGenerationService = {
  async testAPIConnection() {
    try {
      console.log('Testing AI API connection via backend...');
      console.log('Backend API URL:', AI_ENDPOINTS.TEST);
      
      const response = await fetch(AI_ENDPOINTS.TEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('API test successful:', result);
        return { success: true, result: result.result };
      } else {
        console.error('API test failed:', result);
        return { success: false, error: result.error, fullError: result.fullError };
      }
    } catch (error) {
      console.error('Backend API test failed:', error);
      return { success: false, error: 'Failed to connect to backend', fullError: error.message };
    }
  },

  async generateStyleImages(styleName, styleDescription, geminiRecommendations) {
    try {
      console.log('Generating images via backend for style:', styleName);
      console.log('Backend endpoint:', AI_ENDPOINTS.GENERATE);
      
      const response = await fetch(AI_ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          styleName,
          styleDescription,
          geminiRecommendations
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('Received HTML instead of JSON:', htmlText.substring(0, 200));
        throw new Error('Backend server returned HTML instead of JSON. Server may not be running or endpoint may not exist.');
      }
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || `Backend error: ${response.status}`);
      }
      
      console.log('Successfully generated images via backend:', result.images.length);
      
      // Process images to add proxy URLs for better CORS handling
      const processedImages = result.images.map(image => ({
        ...image,
        imageUrl: this.createProxyUrl(image.imageUrl),
        originalUrl: image.imageUrl
      }));
      
      return processedImages;
      
    } catch (error) {
      console.error('Error generating images via backend:', error);
      
      // Provide specific error messages based on error type
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on port 5000.');
      } else if (error.message.includes('HTML instead of JSON')) {
        throw new Error('Backend endpoint not found. Please check if the server is running correctly.');
      } else {
        throw new Error(`Failed to generate images: ${error.message}`);
      }
    }
  },

  // Legacy method - now handled by backend
  async generateSingleImage(prompt) {
    console.warn('generateSingleImage is deprecated - using backend API instead');
    throw new Error('Direct image generation is no longer supported - use generateStyleImages instead');
  },

  // Legacy methods - now handled by backend
  createImagePrompts() { throw new Error('Method moved to backend'); },
  extractColorPalette() { throw new Error('Method moved to backend'); },
  extractMaterials() { throw new Error('Method moved to backend'); },
  extractFurniture() { throw new Error('Method moved to backend'); },
  getImageTitle() { throw new Error('Method moved to backend'); },
  createImageProxy() { throw new Error('Method moved to backend - use proxy endpoint'); },

  createProxyUrl(originalUrl) {
    // Use backend proxy to handle CORS issues
    const encodedUrl = encodeURIComponent(originalUrl);
    return `${AI_ENDPOINTS.PROXY}/${encodedUrl}`;
  },

  async downloadImage(imageUrl, fileName) {
    try {
      console.log('Downloading image:', imageUrl);
      
      // Use the backend proxy for download to handle CORS
      let downloadUrl = imageUrl;
      
      // If it's not already a proxy URL, create one
      if (!imageUrl.includes('/api/images/ai/proxy/')) {
        downloadUrl = this.createProxyUrl(imageUrl);
      }
      
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'generated-design.jpg';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
      return true;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }
};

export default imageGenerationService;