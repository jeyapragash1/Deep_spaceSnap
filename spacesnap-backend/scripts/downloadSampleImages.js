const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Sample image URLs from Unsplash (royalty-free)
const sampleImages = {
  // Room images
  'room-modern': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'room-bohemian': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
  'room-traditional': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  'room-scandinavian': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
  
  // Color palette images (using solid color images)
  'palette-neutral': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
  'palette-warm': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
  'palette-cool': 'https://images.unsplash.com/photo-1550684376-efcbd6babd64?w=800&h=600&fit=crop',
  'palette-vibrant': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  
  // Texture images
  'texture-smooth': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'texture-natural': 'https://images.unsplash.com/photo-1574439279456-6b2f6751f3c3?w=800&h=600&fit=crop',
  'texture-luxurious': 'https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=800&h=600&fit=crop',
  'texture-mixed': 'https://images.unsplash.com/photo-1583395293432-7ba102fd24f1?w=800&h=600&fit=crop',
  
  // Art images
  'art-abstract': 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
  'art-nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'art-classical': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'art-eclectic': 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800&h=600&fit=crop',
  
  // Furniture images
  'furniture-modern': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'furniture-vintage': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
  'furniture-classic': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  'furniture-scandinavian': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
  
  // Style showcase images
  'modern': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'minimalist': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
  'bohemian': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
  'scandinavian': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
  'industrial': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'traditional': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  'transitional': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  'eclectic': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
  'classical': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
  'maximalist': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop'
};

// Function to download an image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const imagesDir = path.join(__dirname, '..', '..', 'images');
    const filePath = path.join(imagesDir, filename + '.jpg');
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  ${filename}.jpg already exists`);
      resolve(true);
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}.jpg`);
          resolve(true);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        file.close();
        fs.unlink(filePath, () => {}); // Delete incomplete file
        resolve(false);
      }
    });
    
    request.on('error', (err) => {
      console.log(`❌ Error downloading ${filename}:`, err.message);
      file.close();
      fs.unlink(filePath, () => {}); // Delete incomplete file
      resolve(false);
    });
    
    file.on('error', (err) => {
      console.log(`❌ File write error for ${filename}:`, err.message);
      fs.unlink(filePath, () => {});
      resolve(false);
    });
  });
};

// Main download function
const downloadAllImages = async () => {
  try {
    const imagesDir = path.join(__dirname, '..', '..', 'images');
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`📁 Created images directory: ${imagesDir}`);
    }
    
    console.log('🌐 Starting image download process...');
    console.log(`📁 Downloading images to: ${imagesDir}`);
    
    let totalDownloaded = 0;
    let totalFailed = 0;
    
    // Download all images
    for (const [filename, url] of Object.entries(sampleImages)) {
      try {
        const success = await downloadImage(url, filename);
        if (success) totalDownloaded++;
        else totalFailed++;
        
        // Small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`❌ Error processing ${filename}:`, error.message);
        totalFailed++;
      }
    }
    
    console.log('\n📊 Download Summary:');
    console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
    console.log(`❌ Failed downloads: ${totalFailed} images`);
    
    if (totalDownloaded > 0) {
      console.log('\n🚀 Next steps:');
      console.log('1. Review downloaded images in the images/ directory');
      console.log('2. Replace any images you want to customize');
      console.log('3. Run: node scripts/uploadQuizImages.js');
    }
    
  } catch (error) {
    console.error('❌ Download process failed:', error);
  }
};

// Command line execution
if (require.main === module) {
  downloadAllImages();
}

module.exports = { downloadAllImages };