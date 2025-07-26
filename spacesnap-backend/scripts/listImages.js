const mongoose = require('mongoose');
require('dotenv').config();
const Image = require('../models/Image');

async function listAll() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spacesnap');
  const images = await Image.find({}, { data: 0 }).sort({ name: 1 });
  console.log('All images in database:');
  images.forEach(img => {
    console.log(`  http://localhost:5000/api/images/${img.name} (${img.category})`);
  });
  await mongoose.disconnect();
}

listAll();