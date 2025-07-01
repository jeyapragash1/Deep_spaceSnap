// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.get('/adduser', async (req, res) => {
  try {
    const newUser = new User({
      name: 'Final Test User',
      email: `finaltest${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'password123',
    });
    await newUser.save();
    res.status(201).json({ 
      message: 'SUCCESS! Your full server is connected and can write to the database!',
      user: newUser 
    });
  } catch (error) {
    res.status(500).send('Server Error while creating user.');
  }
});

module.exports = router;