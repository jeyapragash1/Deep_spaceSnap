import geminiService from "./geminiNanoService";

async function imageSourceToElement(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    if (imageSource instanceof File || imageSource instanceof Blob) {
      img.src = URL.createObjectURL(imageSource);
    } else if (typeof imageSource === "string") {
      img.src = imageSource;
    } else {
      reject(new Error("Unsupported image source"));
    }
  });
}

export async function analyzeRoomWithGeminiNano(imageSource, customPrompt = '') {
  try {
    
    const isAvailable = await geminiService.checkAvailability();
    if (!isAvailable) {
      throw new Error('Gemini API key is not configured');
    }

    // Convert image source to element
    const imageElement = await imageSourceToElement(imageSource);
    
    // Analyze with Gemini API
    const analysis = await geminiService.analyzeRoom(imageElement, customPrompt);
    
    if (!analysis.success) {
      throw new Error(analysis.error);
    }

    return {
      resultImageUrl: imageSource, 
      analysis: analysis.analysis,
      suggestions: analysis.suggestions,
      wallMaskUrl: null,
      floorMaskUrl: null,
      ceilingMaskUrl: null,
      geminiAnalysis: true
    };
  } catch (error) {
    throw error; 
  }
}

export async function generateCustomizationPrompt(imageSource, changes) {
  try {
    const isAvailable = await geminiService.checkAvailability();
    if (!isAvailable) {
      return { success: false, error: 'Gemini API not available' };
    }

    const imageElement = await imageSourceToElement(imageSource);
    const result = await geminiService.generateCustomization(imageElement, changes);
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateImagePrompt(analysis, roomStyle, aiStyle, customPrompt) {
  try {
    const result = await geminiService.generateImagePrompt(analysis, roomStyle, aiStyle, customPrompt);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateImageWithNanoBanana(imageSource, prompt) {
  try {
    const imageElement = await imageSourceToElement(imageSource);
    
    const result = await geminiService.generateImage(imageElement, prompt);
    
    if (result.success) {
      return result.imageUrl;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    throw error;
  }
}

export default { 
  analyzeRoomWithGeminiNano, 
  generateCustomizationPrompt,
  generateImagePrompt,
  generateImageWithNanoBanana
};
