// spacesnap-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const designerRoutes = require('./routes/designerRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <-- IMPORT NEW ROUTES

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.send('API is running...'));
  app.use('/api/users', userRoutes);
  app.use('/api/designers', designerRoutes);
  app.use('/api/admin', adminRoutes); // <-- USE NEW ROUTES

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

startServer();