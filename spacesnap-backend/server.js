// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // The only other route file we need for admin
const quizRoutes = require('./routes/quizRoutes');
const imageRoutes = require('./routes/imageRoutes');

const startServer = async () => {
  await connectDB();
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.get('/', (req, res) => res.send('API is running...'));
  app.use('/api/users', userRoutes); // For public actions
  app.use('/api/admin', adminRoutes); // For all protected admin actions
  app.use('/api/quiz', quizRoutes); // Quiz routes
  app.use('/api/images', imageRoutes); // Image upload and retrieval routes
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};
startServer();