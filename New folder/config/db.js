// config/db.js

const mongoose = require('mongoose');

// --- PASTE YOUR REAL CONNECTION STRING HERE ---
// In the line below, replace "YOUR_UNIQUE_STRING_PASTED_HERE" with the
// long string you just copied from the MongoDB Atlas website.
const connectionString = "YOUR_UNIQUE_STRING_PASTED_HERE";

// --- VERY IMPORTANT: REPLACE THE PASSWORD IN THE STRING ---
// After you paste your string, you MUST find the <password> placeholder inside it
// and replace it with your simple password: testpassword123

// Example of a FINAL, CORRECT string:
// const connectionString = "mongodb://iit21080:testpassword123@ac-abcde12-shard-00-00.46v8p6m.mongodb.net:27017,ac-abcde12-shard-00-01.46v8p6m.mongodb.net:27017,ac-abcde12-shard-00-02.46v8p6m.mongodb.net:27017/SpaceSnapDB?ssl=true&replicaSet=atlas-wxyz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";


const connectDB = async () => {
  try {
    // We are now connecting with the hardcoded string directly.
    // It's important to replace the password placeholder inside the string itself.
    const finalConnectionString = connectionString.replace('<password>', 'testpassword123');

    const conn = await mongoose.connect(finalConnectionString);

    console.log(`--- DATABASE CONNECTION SUCCESSFUL ---`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`--- DATABASE CONNECTION FAILED ---`);
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;