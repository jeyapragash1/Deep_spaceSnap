// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- THIS IS THE CRUCIAL FIX ---
// Load environment variables from .env file immediately.
// This line MUST be here, at the top, before any other file is imported.
dotenv.config();

// Now that .env is loaded, we can safely import other files that use it.
const connectDB = require('./config/db');

// --- SERVER STARTUP FUNCTION ---
const startServer = async () => {
  // The database connection can now see the process.env.MONGO_URI variable
  await connectDB();

  // Initialize Express app
  const app = express();

  // --- MIDDLEWARE ---
  app.use(cors());
  app.use(express.json());

  // --- ROUTES ---
  app.get('/', (req, res) => {
    res.send('API is running successfully...');
  });

  app.use('/api/test', require('./routes/testRoutes'));

  // --- SERVER LISTENER ---
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// --- EXECUTE THE STARTUP ---
startServer();