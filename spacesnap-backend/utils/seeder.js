// utils/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// --- LOAD .ENV VARIABLES (Robust Method) ---
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- LOAD ALL MODELS ---
const User = require('../models/User');
const Design = require('../models/Design');
const Consultation = require('../models/Consultation');

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Seeder connected to MongoDB...');
    } catch (err) {
        console.error(`❌ Seeder Connection Error: ${err.message}`);
        process.exit(1);
    }
};

// --- THE COMPLETE SAMPLE DATA SET ---
const createSampleData = () => {
    console.log('Preparing rich sample data...');

    // We will create users with a simple password: "password123"
    const password = 'password123';

    // --- USERS ---
    const users = [
        { _id: new mongoose.Types.ObjectId(), name: 'Admin User', email: 'admin@spacesnap.com', password: password, role: 'admin', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'Anya Sharma', email: 'anya.designer@spacesnap.com', password: password, role: 'designer', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'Leo Carter', email: 'leo.designer@spacesnap.com', password: password, role: 'designer', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'Premium User', email: 'premium@spacesnap.com', password: password, role: 'premium', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'Registered User', email: 'registered@spacesnap.com', password: password, role: 'registered', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'John Doe (Pending)', email: 'john.doe@example.com', password: password, role: 'registered', isVerified: true },
        { _id: new mongoose.Types.ObjectId(), name: 'Jane Smith (Pending)', email: 'jane.smith@example.com', password: password, role: 'registered', isVerified: true },
    ];

    const designerAnya = users.find(u => u.email === 'anya.designer@spacesnap.com')._id;
    const designerLeo = users.find(u => u.email === 'leo.designer@spacesnap.com')._id;
    const registeredUser = users.find(u => u.email === 'registered@spacesnap.com')._id;
    const premiumUser = users.find(u => u.email === 'premium@spacesnap.com')._id;

    // --- DESIGNS (Templates created by designers) ---
    const designs = [
        { user: designerAnya, name: 'Modern Living Room Concept', designData: JSON.stringify({ style: "Modern", colors: ["#FFFFFF", "#333333"] }), thumbnail: 'https://source.unsplash.com/random/400x300?modern,livingroom' },
        { user: designerAnya, name: 'Scandinavian Kitchen', designData: JSON.stringify({ style: "Scandinavian", colors: ["#F5F5F5", "#87CEEB"] }), thumbnail: 'https://source.unsplash.com/random/400x300?scandinavian,kitchen' },
        { user: designerLeo, name: 'Bohemian Bedroom Retreat', designData: JSON.stringify({ style: "Bohemian", colors: ["#DCC9B6", "#6B7A6A"] }), thumbnail: 'https://source.unsplash.com/random/400x300?bohemian,bedroom' },
        { user: designerLeo, name: 'Industrial Workspace', designData: JSON.stringify({ style: "Industrial", colors: ["#424242", "#CF5C36"] }), thumbnail: 'https://source.unsplash.com/random/400x300?industrial,office' },
    ];

    // --- CONSULTATIONS (Requested by users, assigned to designers) ---
    const consultations = [
        { user: registeredUser, designer: designerAnya, subject: 'Help with my living room layout', message: 'I have an oddly shaped living room and I\'m not sure where to place my sofa. Can you help?', status: 'Pending' },
        { user: registeredUser, designer: designerLeo, subject: 'Color Palette Advice', message: 'I love the minimalist style but I\'m afraid of it looking too cold.', status: 'Completed' },
        { user: premiumUser, designer: designerAnya, subject: 'Urgent: Need help choosing furniture for new apartment', message: 'I am moving next week and need to buy furniture quickly. I like the modern style.', status: 'Pending' },
    ];

    return { users, designs, consultations };
};

// --- SCRIPT FUNCTIONS ---
const importData = async () => {
  try {
    console.log('Wiping existing data from all collections...');
    await Consultation.deleteMany();
    await Design.deleteMany();
    await User.deleteMany();

    const { users, designs, consultations } = createSampleData();

    console.log('Importing Users...');
    // We create users one by one to ensure the pre-save password hash hook runs for each.
    for (const userData of users) {
        const user = new User(userData);
        await user.save();
    }
    
    console.log('Importing Designs...');
    await Design.insertMany(designs);

    console.log('Importing Consultations...');
    await Consultation.insertMany(consultations);

    console.log('\n✅✅✅ Data Imported Successfully! ✅✅✅');
    console.log(`Created ${users.length} users, ${designs.length} designs, and ${consultations.length} consultations.`);
    process.exit();
  } catch (error) {
    console.error(`\n❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
        await Consultation.deleteMany();
        await Design.deleteMany();
        await User.deleteMany();
        console.log('✅ Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error destroying data: ${error}`);
        process.exit(1);
    }
};

// --- SCRIPT RUNNER ---
const runSeeder = async () => {
  await connectDB();
  
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();