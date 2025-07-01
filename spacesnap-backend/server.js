// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file FIRST. This is crucial.
dotenv.config();

// Now import other files that depend on the .env variables
const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes'); // We will use this to test

// Main function to start the server in the correct order
const startServer = async () => {
  // Wait for the database connection to be ready before doing anything else
  await connectDB();

  // Now that the DB is connected, create our web server
  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  // A simple route to check if the server is running
  app.get('/', (req, res) => res.send('API is running...'));
  // A route to test writing to the database
  app.use('/api/test', testRoutes);

  // --- Start the Server ---
  // Start listening for requests from the frontend
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

// --- Execute the server startup ---
startServer();