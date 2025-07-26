const fs = require('fs');
const path = require('path');

// Function to copy files
const copyFile = (source, destination) => {
  try {
    if (!fs.existsSync(source)) {
      console.log(`⚠️  Source file not found: ${source}`);
      return false;
    }
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(source, destination);
    console.log(`✅ Copied: ${path.basename(source)}`);
    return true;
  } catch (error) {
    console.log(`❌ Error copying ${path.basename(source)}:`, error.message);
    return false;
  }
};

// Function to find and copy suitable images from assets
const copyFromAssets = () => {
  const frontendPath = path.join(__dirname, '..', '..', 'spacesnap-frontend');
  const assetsPath = path.join(frontendPath, 'src', 'assets', 'images');
  const targetPath = path.join(__dirname, '..', '..', 'images');
  
  // Create target directory
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  console.log('📁 Copying suitable images from assets folder...');
  
  // Map some existing images to quiz categories
  const imageMapping = {
    // Use some interior images for rooms
    'room-modern': 'in1.jpg',
    'room-bohemian': 'in2.jpg', 
    'room-traditional': 'in3.jpg',
    'room-scandinavian': 'in4.jpg',
    
    // Use various images for different categories
    'palette-neutral': '1.jpg',
    'palette-warm': '2.jpg',
    'palette-cool': '3.jpg',
    'palette-vibrant': '4.jpg',
    
    'texture-smooth': 'marble-tile.jpg',
    'texture-natural': 'light-wood.jpg',
    'texture-luxurious': '5.jpg',
    'texture-mixed': '6.jpg',
    
    'art-abstract': 'painting.jpg',
    'art-nature': 'plant.jpg',
    'art-classical': '7.jpg',
    'art-eclectic': '8.jpg',
    
    'furniture-modern': 'sofa.webp',
    'furniture-vintage': '9.jpg',
    'furniture-classic': '10.jpg',
    'furniture-scandinavian': '11.jpg',
    
    // Style showcase images
    'modern': 'in5.jpg',
    'minimalist': 'in6.jpg',
    'bohemian': 'in7.jpg',
    'scandinavian': 'in8.jpg',
    'industrial': 'in9.jpg',
    'traditional': 'in10.jpg',
    'transitional': 'in11.jpg',
    'eclectic': 'in12.jpg',
    'classical': '12.jpg',
    'maximalist': '13.jpg'
  };
  
  let copiedCount = 0;
  
  for (const [targetName, sourceName] of Object.entries(imageMapping)) {
    const sourcePath = path.join(assetsPath, sourceName);
    const destPath = path.join(targetPath, targetName + path.extname(sourceName));
    
    if (copyFile(sourcePath, destPath)) {
      copiedCount++;
    }
  }
  
  console.log(`✅ Copied ${copiedCount} images from assets folder`);
  return copiedCount;
};

// Function to copy SVG placeholders
const copySVGPlaceholders = () => {
  const frontendPath = path.join(__dirname, '..', '..', 'spacesnap-frontend');
  const targetPath = path.join(__dirname, '..', '..', 'images');
  
  console.log('📁 Copying SVG placeholders as fallbacks...');
  
  let copiedCount = 0;
  
  // Copy quiz SVGs
  const quizSVGPath = path.join(frontendPath, 'public', 'quiz');
  if (fs.existsSync(quizSVGPath)) {
    const svgFiles = fs.readdirSync(quizSVGPath).filter(file => file.endsWith('.svg'));
    
    for (const svgFile of svgFiles) {
      const sourcePath = path.join(quizSVGPath, svgFile);
      const targetName = path.basename(svgFile, '.svg');
      const destPath = path.join(targetPath, targetName + '.svg');
      
      // Only copy if we don't already have a JPG version
      const jpgVersion = path.join(targetPath, targetName + '.jpg');
      const webpVersion = path.join(targetPath, targetName + '.webp');
      
      if (!fs.existsSync(jpgVersion) && !fs.existsSync(webpVersion)) {
        if (copyFile(sourcePath, destPath)) {
          copiedCount++;
        }
      }
    }
  }
  
  // Copy style SVGs
  const styleSVGPath = path.join(frontendPath, 'public', 'styles');
  if (fs.existsSync(styleSVGPath)) {
    const svgFiles = fs.readdirSync(styleSVGPath).filter(file => file.endsWith('.svg'));
    
    for (const svgFile of svgFiles) {
      const sourcePath = path.join(styleSVGPath, svgFile);
      const targetName = path.basename(svgFile, '.svg');
      const destPath = path.join(targetPath, targetName + '.svg');
      
      // Only copy if we don't already have a JPG version
      const jpgVersion = path.join(targetPath, targetName + '.jpg');
      const webpVersion = path.join(targetPath, targetName + '.webp');
      
      if (!fs.existsSync(jpgVersion) && !fs.existsSync(webpVersion)) {
        if (copyFile(sourcePath, destPath)) {
          copiedCount++;
        }
      }
    }
  }
  
  console.log(`✅ Copied ${copiedCount} SVG placeholders`);
  return copiedCount;
};

// Main function
const copyAllImages = () => {
  console.log('🚀 Starting image copying process...');
  
  const targetPath = path.join(__dirname, '..', '..', 'images');
  console.log(`📁 Target directory: ${targetPath}`);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    console.log('📁 Created images directory');
  }
  
  const assetsCopied = copyFromAssets();
  const svgsCopied = copySVGPlaceholders();
  
  console.log('\n📊 Copy Summary:');
  console.log(`✅ Images from assets: ${assetsCopied}`);
  console.log(`✅ SVG placeholders: ${svgsCopied}`);
  console.log(`✅ Total files copied: ${assetsCopied + svgsCopied}`);
  
  console.log('\n🚀 Next step: Run the upload script');
  console.log('💻 Command: node scripts/uploadQuizImages.js');
};

// Run if called directly
if (require.main === module) {
  copyAllImages();
}

module.exports = { copyAllImages };