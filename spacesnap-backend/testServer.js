const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Image = require('./models/Image');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spacesnap')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test route
app.get('/', (req, res) => {
  res.send('Image Test Server Running!');
});

// Get image by name
app.get('/api/images/:name', async (req, res) => {
  try {
    console.log(`🔍 Looking for image: ${req.params.name}`);
    
    const image = await Image.findOne({ name: req.params.name });
    
    if (!image) {
      console.log(`❌ Image not found: ${req.params.name}`);
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log(`✅ Found image: ${image.name} (${image.contentType})`);

    // Convert base64 back to buffer
    const imageBuffer = Buffer.from(image.data, 'base64');

    // Set appropriate headers
    res.set({
      'Content-Type': image.contentType,
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=31536000'
    });

    res.send(imageBuffer);

  } catch (error) {
    console.error('❌ Error retrieving image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
});

// List images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find({}, { data: 0 }).limit(10).sort({ name: 1 });
    
    const imageList = images.map(img => ({
      name: img.name,
      category: img.category,
      contentType: img.contentType,
      size: img.size,
      url: `/api/images/${img.name}`
    }));

    res.json({
      total: images.length,
      images: imageList
    });

  } catch (error) {
    console.error('❌ Error listing images:', error);
    res.status(500).json({ message: 'Error listing images' });
  }
});

const PORT = 5001; // Use different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`🚀 Image Test Server running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}/api/images`);
});