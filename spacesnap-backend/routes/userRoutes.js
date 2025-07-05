// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// --- REGISTER ROUTE ---
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


// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role, 
                name: user.name,
                avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`
            } 
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(`LOGIN SERVER ERROR: ${err.message}`);
        res.status(500).json({ msg: 'Server error' });
    }
});


// --- GET ALL USERS ---
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- UPGRADE TO PREMIUM ROUTE ---
router.put('/upgrade-to-premium', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.role !== 'registered') {
            return res.status(400).json({ msg: 'Only registered users can upgrade.' });
        }
        user.role = 'premium';
        await user.save();

        const payload = { 
            user: { 
                id: user.id, 
                role: user.role, // This will now be 'premium'
                name: user.name,
                avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`
            } 
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('UPGRADE ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;