// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTER ROUTE (Simplified for reliability) ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ msg: 'Registration successful! Please log in.' });
    } catch (err) {
        console.error(`REGISTER ERROR: ${err.message}`);
        res.status(500).json({ msg: 'Server registration error' });
    }
});


// --- LOGIN ROUTE (This is the new, bulletproof version) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password' });
        }

        // 1. Find the user by email, but do not select their password yet.
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare the submitted password with the user's stored password.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. If passwords match, create the JWT payload.
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role, 
                name: user.name,
                avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`
            } 
        };

        // 4. Sign the token and send it as a successful response.
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
        // This catch block will handle any unexpected errors during the process.
        console.error(`LOGIN SERVER ERROR: ${err.message}`);
        res.status(500).json({ msg: 'Server error' });
    }
});


// --- GET ALL USERS (This route is needed for the admin dashboard) ---
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;