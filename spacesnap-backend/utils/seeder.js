// utils/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load all necessary models
const User = require('../models/User');
const Design = require('../models/Design');
const Consultation = require('../models/Consultation');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Seeder connected to MongoDB...');
    } catch (err) {
        console.error(`❌ Seeder Connection Error: ${err.message}`);
        process.exit(1);
    }
};

// --- This function creates all your specific, detailed sample data ---
const createSampleData = () => {
    console.log('Preparing detailed sample data for all dashboards...');

    const password = 'password1'; // The password for all users
    const now = new Date();

    const users = [
        // Your 4 main users
        { _id: new mongoose.Types.ObjectId(), name: 'Jeyapragash (Admin)', email: 'jeyapragash@gmail.com', password: password, role: 'admin', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 30)) },
        { _id: new mongoose.Types.ObjectId(), name: 'Shahnas (Designer)', email: 'shahnas@gmail.com', password: password, role: 'designer', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 25)) },
        { _id: new mongoose.Types.ObjectId(), name: 'Akeesha (Registered)', email: 'akeesha@gmail.com', password: password, role: 'registered', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 20)) },
        { _id: new mongoose.Types.ObjectId(), name: 'Himna (Premium)', email: 'himna@gmail.com', password: password, role: 'premium', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 15)) },
        // More users for a realistic list
        { _id: new mongoose.Types.ObjectId(), name: 'Pending Designer App', email: 'pending.designer@gmail.com', password: password, role: 'registered', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 10)) },
        { _id: new mongoose.Types.ObjectId(), name: 'Leo Carter', email: 'leo.carter@gmail.com', password: password, role: 'registered', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 5)) },
        { _id: new mongoose.Types.ObjectId(), name: 'Maria Garcia', email: 'maria.garcia@gmail.com', password: password, role: 'premium', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 2)) },
        { _id: new mongoose.Types.ObjectId(), name: 'John Davis (Designer)', email: 'john.davis@gmail.com', password: password, role: 'designer', isVerified: true, createdAt: new Date(now.setDate(now.getDate() - 1)) },
    ];
    
    const designs = [
        { name: 'Himna\'s Modern Living Room', designData: JSON.stringify({ wallColor: '#EAEAEA'}), thumbnail: 'https://source.unsplash.com/random/400x300?modern,livingroom', user: users[3]._id },
        { name: 'Akeesha\'s Cozy Corner', designData: JSON.stringify({ wallColor: '#DCC9B6'}), thumbnail: 'https://source.unsplash.com/random/400x300?cozy,bedroom', user: users[2]._id },
        { name: 'Himna\'s Minimalist Office', designData: JSON.stringify({ wallColor: '#F5F5F5'}), thumbnail: 'https://source.unsplash.com/random/400x300?minimalist,office', user: users[3]._id },
        { name: 'Maria\'s Scandinavian Dining', designData: JSON.stringify({ wallColor: '#FFFFFF'}), thumbnail: 'https://source.unsplash.com/random/400x300?scandinavian,dining', user: users[6]._id },
        { name: 'Akeesha\'s First Design', designData: JSON.stringify({ wallColor: '#87986a'}), thumbnail: 'https://source.unsplash.com/random/400x300?interior,design', user: users[2]._id },
    ];

    const consultations = [
        { subject: 'Help with my small apartment', message: 'Hi Shahnas, I need help making my small apartment feel bigger.', status: 'Pending', user: users[3]._id, designer: users[1]._id },
        { subject: 'Color palette advice', message: 'I\'m struggling to pick a color for my bedroom.', status: 'Accepted', user: users[2]._id, designer: users[1]._id },
        { subject: 'Furniture placement for office', message: 'Hi John, I need help arranging my home office for productivity.', status: 'Pending', user: users[6]._id, designer: users[7]._id },
        { subject: 'Full Home Redesign', message: 'We just bought a new house and need help with everything!', status: 'Completed', user: users[6]._id, designer: users[1]._id },
    ];

    return { users, designs, consultations };
};

// --- IMPORT FUNCTION ---
const importData = async () => {
  try {
    console.log('Wiping all existing data...');
    await Consultation.deleteMany();
    await Design.deleteMany();
    await User.deleteMany();

    const { users, designs, consultations } = createSampleData();

    console.log('Importing Users...');
    // We create users one by one to ensure the pre-save password hash hook runs for each
    for (const userData of users) {
        const user = new User(userData);
        await user.save();
    }
    
    console.log('Importing Designs...');
    await Design.insertMany(designs);

    console.log('Importing Consultations...');
    await Consultation.insertMany(consultations);

    console.log('\n✅✅✅ Detailed Data Imported Successfully! ✅✅✅\n');
    console.log('You can now log in with the following credentials (password for all is "password1"):');
    console.log('----------------------------------------------------');
    users.forEach(u => {
        console.log(`${u.role.padEnd(10, ' ')}: ${u.email}`);
    });
    console.log('----------------------------------------------------');

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