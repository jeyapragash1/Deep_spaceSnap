const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/spacesnap';

// Define the image schema
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  data: { type: String, required: true },
  contentType: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  metadata: {
    questionNumber: Number,
    answerId: String,
    description: String,
    stylePoints: Object
  },
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

// Quiz question mappings based on the strategy document
const questionMappings = {
  'Question 1': {
    question: "How do you primarily use your living space?",
    answers: {
      'Q1.A': { id: '1a', text: 'Relaxing/Resting', stylePoints: { scandinavian: 5 } },
      'Q1.B': { id: '1b', text: 'Entertaining Guests', stylePoints: { modern: 5 } },
      'Q1.C': { id: '1c', text: 'Working/Studying', stylePoints: { minimalist: 5 } },
      'Q1.D': { id: '1d', text: 'Family Time', stylePoints: { rustic: 5 } }
    }
  },
  'Question 2': {
    question: "What colors do you prefer in your home?",
    answers: {
      'Q2.A': { id: '2a', text: 'Neutral tones (Whites, Grays, Beiges)', stylePoints: { scandinavian: 5 } },
      'Q2.B': { id: '2b', text: 'Bold colors (Red, Yellow, Green)', stylePoints: { bohemian: 5 } },
      'Q2.C': { id: '2c', text: 'Earthy tones (Greens, Browns)', stylePoints: { rustic: 5 } },
      'Q2.D': { id: '2d', text: 'Pastels (Light Pink, Blue, Lavender)', stylePoints: { 'shabby-chic': 5 } }
    }
  },
  'Question 3': {
    question: "What type of furniture do you prefer?",
    answers: {
      'Q3.A': { id: '3a', text: 'Modern, Clean lines, minimal design', stylePoints: { modern: 5 } },
      'Q3.B': { id: '3b', text: 'Vintage, Timeless and classic pieces', stylePoints: { rustic: 5 } },
      'Q3.C': { id: '3c', text: 'Industrial, Exposed metal and wood', stylePoints: { industrial: 5 } },
      'Q3.D': { id: '3d', text: 'Eclectic, A mix of different styles and eras', stylePoints: { bohemian: 5 } }
    }
  },
  'Question 4': {
    question: "Which of these best describes your preferred vibe?",
    answers: {
      'Q4.A': { id: '4a', text: 'Cozy and inviting', stylePoints: { rustic: 5 } },
      'Q4.B': { id: '4b', text: 'Bright and open', stylePoints: { scandinavian: 5 } },
      'Q4.C': { id: '4c', text: 'Calm and serene', stylePoints: { minimalist: 5 } },
      'Q4.D': { id: '4d', text: 'Luxurious and sophisticated', stylePoints: { modern: 5 } }
    }
  },
  'Question 5': {
    question: "How much furniture do you want in your space?",
    answers: {
      'Q5.A': { id: '5a', text: 'A few statement pieces', stylePoints: { minimalist: 5 } },
      'Q5.B': { id: '5b', text: 'Plenty of comfortable seating', stylePoints: { scandinavian: 5 } },
      'Q5.C': { id: '5c', text: 'A few high-end, luxurious pieces', stylePoints: { modern: 5 } },
      'Q5.D': { id: '5d', text: 'A mix of old and new furniture', stylePoints: { bohemian: 5 } }
    }
  },
  'Question 6': {
    question: "Which material do you prefer for your furniture and finishes?",
    answers: {
      'Q6.A': { id: '6a', text: 'Wood', stylePoints: { rustic: 5 } },
      'Q6.B': { id: '6b', text: 'Metal and Glass', stylePoints: { industrial: 5 } },
      'Q6.C': { id: '6c', text: 'Fabric (upholstered)', stylePoints: { 'shabby-chic': 5 } },
      'Q6.D': { id: '6d', text: 'Leather and Polished Wood', stylePoints: { modern: 5 } }
    }
  },
  'Question 7': {
    question: "What type of lighting do you prefer?",
    answers: {
      'Q7.A': { id: '7a', text: 'Natural light with big windows', stylePoints: { scandinavian: 5 } },
      'Q7.B': { id: '7b', text: 'Bright and well-lit with lamps', stylePoints: { modern: 5 } },
      'Q7.C': { id: '7c', text: 'Soft, ambient lighting', stylePoints: { bohemian: 5 } },
      'Q7.D': { id: '7d', text: 'Moody, low-light atmosphere', stylePoints: { industrial: 5 } }
    }
  }
};

async function uploadQuizQuestionImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Path to Style Quiz images folder
    const quizImagesPath = path.join(__dirname, '..', '..', '..', 'Style Quiz images');
    
    // Read all question directories
    const questionDirs = await fs.readdir(quizImagesPath);
    
    let uploadCount = 0;
    let errorCount = 0;

    for (const questionDir of questionDirs) {
      const questionPath = path.join(quizImagesPath, questionDir);
      const stat = await fs.stat(questionPath);
      
      if (!stat.isDirectory()) continue;
      
      console.log(`\nProcessing ${questionDir}`);
      
      // Get question mapping
      const questionData = questionMappings[questionDir];
      if (!questionData) {
        console.warn(`No mapping found for ${questionDir}`);
        continue;
      }
      
      // Read all images in the question directory
      const imageFiles = await fs.readdir(questionPath);
      
      for (const imageFile of imageFiles) {
        if (!imageFile.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
        
        const imagePath = path.join(questionPath, imageFile);
        
        try {
          // Extract answer ID from filename (e.g., Q1.A from filename)
          const answerMatch = imageFile.match(/(Q\d\.[A-D])/i);
          if (!answerMatch) {
            console.warn(`Could not extract answer ID from ${imageFile}`);
            continue;
          }
          
          const answerKey = answerMatch[1].toUpperCase();
          const answerData = questionData.answers[answerKey];
          
          if (!answerData) {
            console.warn(`No answer data found for ${answerKey}`);
            continue;
          }
          
          // Read and optimize the image
          const imageBuffer = await sharp(imagePath)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          
          // Convert to base64
          const base64Data = imageBuffer.toString('base64');
          
          // Create unique name for the image
          const imageName = `quiz-question-${answerData.id}`;
          
          // Check if image already exists
          const existingImage = await Image.findOne({ name: imageName });
          
          if (existingImage) {
            // Update existing image
            existingImage.data = base64Data;
            existingImage.metadata = {
              questionNumber: parseInt(questionDir.match(/\d+/)[0]),
              answerId: answerData.id,
              description: answerData.text,
              stylePoints: answerData.stylePoints
            };
            await existingImage.save();
            console.log(`Updated: ${imageName} - ${answerData.text}`);
          } else {
            // Create new image document
            const newImage = new Image({
              name: imageName,
              data: base64Data,
              contentType: 'image/jpeg',
              category: 'quiz-questions',
              subcategory: questionDir.toLowerCase().replace(' ', '-'),
              metadata: {
                questionNumber: parseInt(questionDir.match(/\d+/)[0]),
                answerId: answerData.id,
                description: answerData.text,
                stylePoints: answerData.stylePoints
              }
            });
            
            await newImage.save();
            console.log(`Uploaded: ${imageName} - ${answerData.text}`);
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
    
    // List all uploaded quiz question images
    const uploadedImages = await Image.find({ category: 'quiz-questions' }).select('name metadata');
    console.log('\nUploaded quiz question images:');
    uploadedImages.forEach(img => {
      console.log(`  - ${img.name}: ${img.metadata.description} (${JSON.stringify(img.metadata.stylePoints)})`);
    });
    
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the upload script
uploadQuizQuestionImages().catch(console.error);