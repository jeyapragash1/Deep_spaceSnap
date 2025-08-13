// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const connectDB = require('./config/db');

// --- Route Imports ---
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const debugQuizRoutes = require('./routes/debugQuizRoutes');
const imageRoutes = require('./routes/imageRoutes');
const consultationRoutes = require('./routes/consultations');
const designRoutes = require('./routes/designs');
// --- NEW: Import your payment routes file ---

const paymentRoutes = require('./routes/paymentRoutes');

const startServer = async () => {
  // Connect to the database first
  await connectDB();

  const app = express();

  // --- Middleware ---
  app.use(cors());
  // Use express.json() to parse JSON bodies, with an increased limit for image data
  app.use(express.json({ limit: '50mb' })); 

  // --- API Routes ---
  // A simple test route to confirm the API is running
  app.get('/', (req, res) => res.send('API is running...'));

  // Mount all the different route handlers
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/debug', debugQuizRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/consultations', consultationRoutes);
  app.use('/api/designs', designRoutes);
  // --- NEW: Mount the payment routes handler ---
  app.use('/api/payments', paymentRoutes);

  // --- Server Initialization ---
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

// Start the server
startServer();