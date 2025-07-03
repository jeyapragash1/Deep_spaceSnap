// utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
// We don't need to import Design or Consultation for this seeder
// const Design = require('../models/Design');
// const Consultation = require('../models/Consultation');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Seeder connected to MongoDB...');
    } catch (err) {
        console.error(`❌ Seeder Connection Error: ${err.message}`);
        process.exit(1);
    }
};

const createUsers = () => {
    const password = 'password123'; // Plain text password
    const users = [
        { name: 'Admin User', email: 'admin@spacesnap.com', password: password, role: 'admin', isVerified: true },
        { name: 'Designer One', email: 'designer1@spacesnap.com', password: password, role: 'designer', isVerified: true },
        { name: 'Premium User', email: 'premium@spacesnap.com', password: password, role: 'premium', isVerified: true },
        { name: 'Registered User', email: 'registered@spacesnap.com', password: password, role: 'registered', isVerified: true },
    ];
    return users;
};

const importData = async () => {
  try {
    console.log('Wiping and re-importing users...');
    await User.deleteMany(); // Clear all old users

    const usersToImport = createUsers();

    // Create users one by one to ensure the pre-save password hash hook runs for each.
    for (const userData of usersToImport) {
        const user = new User(userData);
        await user.save();
    }

    console.log('✅✅✅ Data Imported Successfully! ✅✅✅');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await importData();
};

runSeeder();