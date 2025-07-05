// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables FIRST
dotenv.config();

// Now import all the route modules
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const designerRoutes = require('./routes/designerRoutes');
const designRoutes = require('./routes/designRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Main function to start the server
const startServer = async () => {
  // Wait for the database connection to be ready
  await connectDB();

  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.get('/', (req, res) => res.send('API is running...'));
  
  // --- This is the corrected section ---
  // We tell the Express app to use each of our imported route files
  app.use('/api/users', userRoutes);
  app.use('/api/designers', designerRoutes);
  app.use('/api/designs', designRoutes);
  app.use('/api/consultations', consultationRoutes);
  app.use('/api/profile', profileRoutes);
  
  // --- Start the Server ---
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

// Execute the server startup
startServer();