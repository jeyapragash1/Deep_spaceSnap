// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user = new User({ name, email, password, phoneNumber, otp, otpExpire });
    await user.save();
    
    console.log(`\n--- OTP FOR ${email}: ${otp} ---\n`);
    res.status(201).json({ success: true, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server registration error' });
  }
});

// === LOGIN (This is the corrected route) ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // We add this check to ensure we have the data we need.
  if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Find the user by their email address
    let user = await User.findOne({ email });
    if (!user) {
        // If no user is found, send a clear error response.
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // If passwords don't match, send a clear error response.
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If login is successful, create the JWT payload
    const payload = { 
      user: { 
        id: user.id, 
        role: user.role, 
        name: user.name,
        // We include the avatar in the token for the UI
        avatar: user.avatar || `https://source.unsplash.com/150x150/?portrait,person,${user.id}`
      } 
    };

    // Sign the token and send it back to the frontend
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '5h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    // If any other server error happens, send a response.
    res.status(500).json({ msg: 'Server login error' });
  }
});


// === VERIFY OTP ===
// (The rest of your routes: verify-otp, forgotpassword, etc., are fine and don't need to change)
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }
        user.isVerified = true; user.otp = undefined; user.otpExpire = undefined;
        await user.save();
        
        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message); res.status(500).send('Server Error');
    }
});


module.exports = router;