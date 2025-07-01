// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
// We no longer need the test route, so we can comment it out
// const testRoutes = require('./routes/testRoutes'); 
const userRoutes = require('./routes/userRoutes'); // Import user routes

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/', (req, res) => res.send('API is running...'));
  // app.use('/api/test', testRoutes);
  
  // --- THIS IS THE NEW LINE ---
  app.use('/api/users', userRoutes); // Use our user routes

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

startServer();