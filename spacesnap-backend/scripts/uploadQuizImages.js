const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
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

// Function to convert image file to base64
const processImage = async (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    let processedBuffer;
    let contentType;
    let width, height;

    if (ext === '.svg') {
      // Handle SVG files differently
      processedBuffer = fs.readFileSync(filePath);
      contentType = 'image/svg+xml';
    } else {
      // Process other image formats with Sharp
      const processed = await sharp(filePath)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      const metadata = await sharp(processed).metadata();
      processedBuffer = processed;
      contentType = 'image/jpeg';
      width = metadata.width;
      height = metadata.height;
    }

    return {
      data: processedBuffer.toString('base64'),
      contentType,
      size: processedBuffer.length,
      width,
      height
    };
  } catch (error) {
    console.error(`Error processing image ${filePath}:`, error);
    return null;
  }
};

// Quiz images configuration
const quizImages = [
  // Room images
  { filename: 'room-modern', category: 'quiz', subcategory: 'room', description: 'Modern style room with clean lines and neutral colors' },
  { filename: 'room-bohemian', category: 'quiz', subcategory: 'room', description: 'Bohemian style room with colorful textiles and eclectic decor' },
  { filename: 'room-traditional', category: 'quiz', subcategory: 'room', description: 'Traditional style room with classic furniture and warm tones' },
  { filename: 'room-scandinavian', category: 'quiz', subcategory: 'room', description: 'Scandinavian style room with light colors and natural materials' },
  
  // Color palettes
  { filename: 'palette-neutral', category: 'quiz', subcategory: 'palette', description: 'Neutral color palette with whites, grays, and beiges' },
  { filename: 'palette-warm', category: 'quiz', subcategory: 'palette', description: 'Warm color palette with browns, oranges, and golds' },
  { filename: 'palette-cool', category: 'quiz', subcategory: 'palette', description: 'Cool color palette with blues, greens, and purples' },
  { filename: 'palette-vibrant', category: 'quiz', subcategory: 'palette', description: 'Vibrant color palette with bright, bold colors' },
  
  // Textures
  { filename: 'texture-smooth', category: 'quiz', subcategory: 'texture', description: 'Smooth textures like glass, metal, and polished surfaces' },
  { filename: 'texture-natural', category: 'quiz', subcategory: 'texture', description: 'Natural textures like wood, linen, and organic materials' },
  { filename: 'texture-luxurious', category: 'quiz', subcategory: 'texture', description: 'Luxurious textures like velvet, silk, and marble' },
  { filename: 'texture-mixed', category: 'quiz', subcategory: 'texture', description: 'Mixed textures combining various materials and finishes' },
  
  // Art pieces
  { filename: 'art-abstract', category: 'quiz', subcategory: 'art', description: 'Abstract modern art with bold shapes and colors' },
  { filename: 'art-nature', category: 'quiz', subcategory: 'art', description: 'Nature-inspired art including botanical and landscape themes' },
  { filename: 'art-classical', category: 'quiz', subcategory: 'art', description: 'Classical art with traditional paintings and sculptures' },
  { filename: 'art-eclectic', category: 'quiz', subcategory: 'art', description: 'Eclectic art mixing different styles and mediums' },
  
  // Furniture
  { filename: 'furniture-modern', category: 'quiz', subcategory: 'furniture', description: 'Modern furniture with sleek, contemporary design' },
  { filename: 'furniture-vintage', category: 'quiz', subcategory: 'furniture', description: 'Vintage furniture with retro and antique styling' },
  { filename: 'furniture-classic', category: 'quiz', subcategory: 'furniture', description: 'Classic furniture with timeless, traditional design' },
  { filename: 'furniture-scandinavian', category: 'quiz', subcategory: 'furniture', description: 'Scandinavian furniture with simple, functional design' }
];

// Style images configuration
const styleImages = [
  { filename: 'modern', category: 'style', description: 'Modern interior design style showcase' },
  { filename: 'minimalist', category: 'style', description: 'Minimalist interior design style showcase' },
  { filename: 'bohemian', category: 'style', description: 'Bohemian interior design style showcase' },
  { filename: 'scandinavian', category: 'style', description: 'Scandinavian interior design style showcase' },
  { filename: 'industrial', category: 'style', description: 'Industrial interior design style showcase' },
  { filename: 'traditional', category: 'style', description: 'Traditional interior design style showcase' },
  { filename: 'transitional', category: 'style', description: 'Transitional interior design style showcase' },
  { filename: 'eclectic', category: 'style', description: 'Eclectic interior design style showcase' },
  { filename: 'classical', category: 'style', description: 'Classical interior design style showcase' },
  { filename: 'maximalist', category: 'style', description: 'Maximalist interior design style showcase' }
];

// Function to upload a single image
const uploadImage = async (imageConfig, imagesDir) => {
  try {
    // Try multiple file extensions
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    let filePath = null;
    
    for (const ext of extensions) {
      const testPath = path.join(imagesDir, imageConfig.filename + ext);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    if (!filePath) {
      console.log(`⚠️  Image file not found for: ${imageConfig.filename}`);
      return false;
    }

    // Check if image already exists in database
    const existingImage = await Image.findOne({ name: imageConfig.filename });
    if (existingImage) {
      console.log(`⏭️  Image already exists: ${imageConfig.filename}`);
      return true;
    }

    // Process the image
    const processedImage = await processImage(filePath);
    if (!processedImage) {
      console.log(`❌ Failed to process: ${imageConfig.filename}`);
      return false;
    }

    // Create image document
    const image = new Image({
      name: imageConfig.filename,
      category: imageConfig.category,
      subcategory: imageConfig.subcategory,
      description: imageConfig.description,
      data: processedImage.data,
      contentType: processedImage.contentType,
      size: processedImage.size,
      width: processedImage.width,
      height: processedImage.height
    });

    await image.save();
    console.log(`✅ Uploaded: ${imageConfig.filename}`);
    return true;

  } catch (error) {
    console.error(`❌ Error uploading ${imageConfig.filename}:`, error);
    return false;
  }
};

// Main upload function
const uploadAllImages = async () => {
  try {
    await connectDB();

    // Define base directory for images
    const baseDir = path.join(__dirname, '..', '..', 'images');
    
    console.log('🚀 Starting image upload process...');
    console.log(`📁 Looking for images in: ${baseDir}`);
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log(`📁 Created images directory: ${baseDir}`);
    }

    let totalUploaded = 0;
    let totalFailed = 0;

    // Upload quiz images
    console.log('\n📋 Uploading quiz images...');
    for (const imageConfig of quizImages) {
      const success = await uploadImage(imageConfig, baseDir);
      if (success) totalUploaded++;
      else totalFailed++;
    }

    // Upload style images
    console.log('\n🎨 Uploading style images...');
    for (const imageConfig of styleImages) {
      const success = await uploadImage(imageConfig, baseDir);
      if (success) totalUploaded++;
      else totalFailed++;
    }

    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${totalUploaded} images`);
    console.log(`❌ Failed uploads: ${totalFailed} images`);
    
    if (totalFailed > 0) {
      console.log('\n💡 Tips for failed uploads:');
      console.log('1. Make sure image files exist in the images/ directory');
      console.log('2. Supported formats: .jpg, .jpeg, .png, .webp, .svg');
      console.log('3. Check file names match exactly (case-sensitive)');
    }

  } catch (error) {
    console.error('❌ Upload process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Function to create sample images directory structure
const createSampleStructure = () => {
  const baseDir = path.join(__dirname, '..', '..', 'images');
  const readmePath = path.join(baseDir, 'README.md');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  const readmeContent = `# Style Quiz Images Directory

Place your image files here with the following names:

## Quiz Images (20 files needed):

### Room Images:
- room-modern.jpg
- room-bohemian.jpg  
- room-traditional.jpg
- room-scandinavian.jpg

### Color Palette Images:
- palette-neutral.jpg
- palette-warm.jpg
- palette-cool.jpg
- palette-vibrant.jpg

### Texture Images:
- texture-smooth.jpg
- texture-natural.jpg
- texture-luxurious.jpg
- texture-mixed.jpg

### Art Images:
- art-abstract.jpg
- art-nature.jpg
- art-classical.jpg
- art-eclectic.jpg

### Furniture Images:
- furniture-modern.jpg
- furniture-vintage.jpg
- furniture-classic.jpg
- furniture-scandinavian.jpg

## Style Images (10 files needed):
- modern.jpg
- minimalist.jpg
- bohemian.jpg
- scandinavian.jpg
- industrial.jpg
- traditional.jpg
- transitional.jpg
- eclectic.jpg
- classical.jpg
- maximalist.jpg

## Supported Formats:
- .jpg, .jpeg, .png, .webp, .svg

## Image Requirements:
- Recommended size: 800x600px or similar aspect ratio
- File size: Under 2MB each
- Good quality but web-optimized

Run the upload script: \`node scripts/uploadQuizImages.js\`
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`📝 Created README.md in ${baseDir}`);
};

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'setup') {
  createSampleStructure();
  console.log('📁 Sample directory structure created!');
  console.log('📝 Please add your image files to the images/ directory');
  console.log('🚀 Then run: node scripts/uploadQuizImages.js');
} else {
  uploadAllImages();
}

module.exports = { uploadAllImages, createSampleStructure };