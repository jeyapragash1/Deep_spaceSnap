// utils/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path'); // Import Node.js's built-in path module

// --- THIS IS THE GUARANTEED FIX ---
// This tells dotenv to look for the .env file in the parent directory
// (the root of your 'spacesnap-backend' project). This is a robust method.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load the User model
const User = require('../models/User');

// --- DATABASE CONNECTION LOGIC (for this script only) ---
const connectDB = async () => {
  try {
    // Check if the environment variable was loaded correctly
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file. Ensure the file is in the root of the backend project.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Seeder connected to MongoDB...');
  } catch (err) {
    console.error(`❌ Seeder Connection Error: ${err.message}`);
    process.exit(1); // Exit with failure
  }
};

// --- DATA TO BE IMPORTED ---
const createUsers = async () => {
  // Simple password '123456' for both users
  const password = '123456';

  const users = [
    {
      name: 'Admin User',
      email: 'admin@spacesnap.com',
      password: password, // The pre-save hook in the User model will hash this
      role: 'admin',
    },
    {
      name: 'Designer User',
      email: 'designer@spacesnap.com',
      password: password,
      role: 'designer',
    },
  ];
  return users;
};

// --- FUNCTION TO IMPORT DATA ---
const importData = async () => {
  try {
    // First, delete any existing admin/designer users to avoid duplicates
    await User.deleteMany({ email: { $in: ['admin@spacesnap.com', 'designer@spacesnap.com'] } });

    const usersToImport = await createUsers();
    // The .save() method is not needed here, insertMany is fine, but the model hook will not run.
    // Let's create and save them individually to ensure the hashing hook fires.
    for (const userData of usersToImport) {
        const user = new User(userData);
        await user.save();
    }

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
    await User.deleteMany({ email: { $in: ['admin@spacesnap.com', 'designer@spacesnap.com'] } });
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
  
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();