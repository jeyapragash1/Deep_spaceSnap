import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAfIaAT7D4qEI2yb9E_OQ1HRTLWKhAEoDo';

export const testGeminiAPI = async () => {
  try {
    console.log('Testing Gemini API...');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = "Hello, please respond with 'API is working!' to test the connection.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API Test Success:', text);
    return { success: true, response: text };
  } catch (error) {
    console.error('Gemini API Test Failed:', error);
    return { success: false, error: error.message };
  }
};