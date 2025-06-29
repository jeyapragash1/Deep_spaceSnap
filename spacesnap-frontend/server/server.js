// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Import Routes ---
const authRoutes = require('./routes/auth'); // <-- IMPORT THE NEW ROUTE FILE

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- API Routes ---
app.use('/api/auth', authRoutes); // <-- USE THE AUTH ROUTES

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the SpaceSnap Backend API!');
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});