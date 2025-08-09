const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', apiKey: process.env.LAOZHANG_API_KEY ? 'Present' : 'Missing' });
});

// AI test endpoint
app.post('/api/images/ai/test', async (req, res) => {
  try {
    console.log('Testing AI API connection...');
    console.log('API Key:', process.env.LAOZHANG_API_KEY ? 'Present' : 'Missing');
    
    // Simple test without actual API call first
    res.json({
      success: true,
      message: 'Backend endpoint working',
      apiKeyPresent: !!process.env.LAOZHANG_API_KEY
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`API Key: ${process.env.LAOZHANG_API_KEY ? 'Present' : 'Missing'}`);
});