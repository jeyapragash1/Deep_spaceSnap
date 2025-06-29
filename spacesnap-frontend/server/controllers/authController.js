// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // We will use this now

// --- Register a new user (This part is unchanged) ---
exports.register = async (req, res) => {
  // ... your existing register code ...
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { return res.status(400).json({ message: 'Please provide all required fields.' }); }
    const existingUser = await User.findOne({ email });
    if (existingUser) { return res.status(400).json({ message: 'User with this email already exists.' }); }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }});
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// --- Login an existing user (NEW FUNCTION) ---
exports.login = async (req, res) => {
  try {
    // 1. Get user data from request
    const { email, password } = req.body;

    // 2. Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    // 4. If credentials are correct, create a JWT
    const payload = {
      user: {
        id: user.id, // The user's unique ID from MongoDB
        name: user.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // We need to add this to our .env file
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // 5. Send the token back to the client
        res.status(200).json({
          message: 'Login successful!',
          token,
          user: { id: user.id, name: user.name, email: user.email }
        });
      }
    );

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};