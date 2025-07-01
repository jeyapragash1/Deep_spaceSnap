// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import our User model

// @route   GET /api/test/adduser
// @desc    A test route to create a new user in the database
// @access  Public
router.get('/adduser', async (req, res) => {
  try {
    // Create some sample user data
    const newUser = new User({
      name: 'Test User',
      // Add a random number to the email to ensure it's unique every time
      email: `test${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'password123',
      role: 'premium'
    });

    // Save the new user to the database
    await newUser.save();

    console.log('Test user successfully saved to database!');
    res.status(201).json({ 
      message: 'Success! A new test user was created in your database.',
      user: newUser 
    });

  } catch (error) {
    console.error('Error creating test user:', error.message);
    res.status(500).send('Server Error while creating user.');
  }
});

module.exports = router;