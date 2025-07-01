// utils/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // For hashing passwords

// --- THIS IS THE MOST IMPORTANT FIX ---
// Load environment variables from the .env file FIRST.
dotenv.config();

// Load the User model
const User = require('../models/User');

// --- DATABASE CONNECTION LOGIC (for this script only) ---
const connectDB = async () => {
  try {
    // We use the same working .env file from your main server
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Seeder connected to MongoDB...');
  } catch (err) {
    console.error(`❌ Seeder Connection Error: ${err.message}`);
    process.exit(1); // Exit with failure
  }
};

// --- DATA TO BE IMPORTED ---
const createUsers = async () => {
  // Hash the password before creating the user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt); // Simple password '123456' for both

  const users = [
    {
      name: 'Admin User',
      email: 'admin@spacesnap.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      name: 'Designer User',
      email: 'designer@spacesnap.com',
      password: hashedPassword,
      role: 'designer',
    },
  ];
  return users;
};

// --- FUNCTION TO IMPORT DATA ---
const importData = async () => {
  try {
    // First, delete any existing users to avoid duplicates
    await User.deleteMany();

    const usersToImport = await createUsers();
    await User.insertMany(usersToImport);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

// --- FUNCTION TO DESTROY DATA ---
const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error}`);
    process.exit(1);
  }
};

// --- RUN THE SCRIPT ---
// This connects to the DB first, then decides whether to import or destroy
const runSeeder = async () => {
  await connectDB();
  
  // This allows you to run "node utils/seeder.js -d" to destroy data
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();