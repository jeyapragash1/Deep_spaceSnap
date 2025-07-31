const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/spacesnap';

// Use the existing Image model
const Image = require('../models/Image');

// Style mapping to ensure consistency
const styleMapping = {
  'Bohemian': 'bohemian',
  'Industrial': 'industrial',
  'Rustic': 'rustic',
  'Scandinavian': 'scandinavian',
  'Shabby Chic': 'shabby-chic',
  'minimalist': 'minimalist',
  'modern': 'modern'
};

// Room type extraction
function extractRoomType(filename) {
  const roomTypes = ['bedroom', 'dining room', 'kitchen', 'study room', 'living room', 'washroom', 'bathroom', 'office'];
  const lowerFilename = filename.toLowerCase();
  
  for (const room of roomTypes) {
    if (lowerFilename.includes(room)) {
      return room.replace(' ', '-');
    }
  }
  return 'unknown';
}

async function uploadStyleRoomImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Path to Final Images folder (adjust based on your directory structure)
    const finalImagesPath = path.join(__dirname, '..', '..', '..', 'Final Images');
    
    // Read all style directories
    const styleDirs = await fs.readdir(finalImagesPath);
    
    let uploadCount = 0;
    let errorCount = 0;

    for (const styleDir of styleDirs) {
      const stylePath = path.join(finalImagesPath, styleDir);
      const stat = await fs.stat(stylePath);
      
      if (!stat.isDirectory()) continue;
      
      console.log(`\nProcessing style: ${styleDir}`);
      
      // Get normalized style name
      const normalizedStyle = styleMapping[styleDir] || styleDir.toLowerCase();
      
      // Read all images in the style directory
      const imageFiles = await fs.readdir(stylePath);
      
      for (const imageFile of imageFiles) {
        if (!imageFile.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
        
        const imagePath = path.join(stylePath, imageFile);
        
        try {
          // Read and optimize the image
          const imageBuffer = await sharp(imagePath)
            .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          
          // Convert to base64
          const base64Data = imageBuffer.toString('base64');
          
          // Extract room type
          const roomType = extractRoomType(imageFile);
          
          // Create unique name for the image
          const imageName = `style-${normalizedStyle}-${roomType}`;
          
          // Check if image already exists
          const existingImage = await Image.findOne({ name: imageName });
          
          if (existingImage) {
            // Update existing image
            existingImage.data = base64Data;
            existingImage.contentType = 'image/jpeg';
            existingImage.size = imageBuffer.length;
            existingImage.metadata = {
              style: normalizedStyle,
              roomType: roomType,
              originalName: imageFile
            };
            await existingImage.save();
            console.log(`Updated: ${imageName}`);
          } else {
            // Create new image document
            const newImage = new Image({
              name: imageName,
              data: base64Data,
              contentType: 'image/jpeg',
              category: 'style-rooms',
              subcategory: normalizedStyle,
              size: imageBuffer.length,
              metadata: {
                style: normalizedStyle,
                roomType: roomType,
                originalName: imageFile
              }
            });
            
            await newImage.save();
            console.log(`Uploaded: ${imageName}`);
          }
          
          uploadCount++;
        } catch (error) {
          console.error(`Error processing ${imageFile}:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log(`\n✓ Upload complete!`);
    console.log(`  Successfully uploaded: ${uploadCount} images`);
    console.log(`  Errors: ${errorCount}`);
    
    // List all uploaded style room images
    const uploadedImages = await Image.find({ category: 'style-rooms' }).select('name metadata');
    console.log('\nUploaded images:');
    uploadedImages.forEach(img => {
      console.log(`  - ${img.name} (${img.metadata.style} - ${img.metadata.roomType})`);
    });
    
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the upload script
uploadStyleRoomImages().catch(console.error);