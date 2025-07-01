// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This reads the working MONGO_URI from your .env file
    // and connects without any of the old deprecated options.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DATABASE CONNECTION FAILED: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;