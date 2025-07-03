// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const designerRoutes = require('./routes/designerRoutes');
// You can add other route files here later (e.g., adminRoutes)

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.get('/', (req, res) => res.send('API is running...'));
  
  // This line tells the server that any request to '/api/users'
  // should be handled by the 'userRoutes.js' file. This is crucial.
  app.use('/api/users', userRoutes);
  
  app.use('/api/designers', designerRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

startServer();