// server/scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User'); // Adjust path to your User model

dotenv.config({ path: '../.env' }); // Point to the .env file in the parent directory

const usersToSeed = [
  {
    name: 'Admin User',
    email: 'admin@spacesnap.com',
    password: 'password123', // Use a strong password in production
    role: 'admin',
  },
  {
    name: 'Designer One',
    email: 'designer1@spacesnap.com',
    password: 'password123',
    role: 'designer',
  },
];

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing users to avoid duplicates (optional, but good for testing)
    // await User.deleteMany({});
    // console.log('Existing users cleared.');

    for (const userData of usersToSeed) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.log(`User ${userData.email} already exists. Skipping.`);
            continue;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Create new user with hashed password
        const user = new User({
            ...userData,
            password: hashedPassword,
        });
        
        // Save the user
        await user.save();
        console.log(`User ${user.name} with role '${user.role}' created.`);
    }

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Run the seeding function
seedDB();