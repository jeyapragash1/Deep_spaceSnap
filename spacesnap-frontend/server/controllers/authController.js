// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register a new user ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // The 'role' will be set to 'registered_user' by default from the model
    });

    const savedUser = await newUser.save();

    res.status(201).json({ 
        message: 'User registered successfully!',
        user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// --- Login an existing user ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    // Create a JWT payload including the user's role
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role, // <-- THIS IS THE IMPORTANT ADDITION
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Send the complete user object, including the role, back to the client
        res.status(200).json({
          message: 'Login successful!',
          token,
          user: { 
              id: user.id, 
              name: user.name, 
              email: user.email, 
              role: user.role // <-- THIS IS THE IMPORTANT ADDITION
            }
        });
      }
    );

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};