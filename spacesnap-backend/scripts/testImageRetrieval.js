const mongoose = require('mongoose');
require('dotenv').config();

// Import the Image model
const Image = require('../models/Image');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spacesnap');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test image retrieval
const testImageRetrieval = async () => {
  try {
    await connectDB();

    console.log('🔍 Testing image retrieval from database...\n');

    // List all images
    const allImages = await Image.find({}, { data: 0 }).limit(10);
    console.log(`📊 Found ${allImages.length} images in database:`);
    
    allImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.name} (${img.category}) - ${img.contentType} - ${(img.size / 1024).toFixed(1)}KB`);
    });

    // Test specific image retrieval
    console.log('\n🔍 Testing specific image retrieval:');
    
    const testImages = ['room-modern', 'palette-vibrant', '4.jpg'];
    
    for (const imageName of testImages) {
      console.log(`\nTesting: ${imageName}`);
      const image = await Image.findOne({ name: imageName });
      
      if (image) {
        console.log(`✅ Found: ${image.name}`);
        console.log(`   Category: ${image.category}`);
        console.log(`   Type: ${image.contentType}`);
        console.log(`   Size: ${(image.size / 1024).toFixed(1)}KB`);
        console.log(`   Dimensions: ${image.width || 'unknown'}x${image.height || 'unknown'}`);
        console.log(`   URL would be: /api/images/${image.name}`);
      } else {
        console.log(`❌ Not found: ${imageName}`);
      }
    }

    // Check what images match the pattern
    console.log('\n🔍 Images that might match "4":');
    const numberImages = await Image.find({ 
      name: { $regex: '4', $options: 'i' } 
    }, { data: 0 });
    
    numberImages.forEach(img => {
      console.log(`   ${img.name} - ${img.category} - /api/images/${img.name}`);
    });

  } catch (error) {
    console.error('❌ Error testing image retrieval:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the test
testImageRetrieval();