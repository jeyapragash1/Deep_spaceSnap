// routes/designerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// A helper middleware to check if the logged-in user is an admin
const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admins only' });
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/designers
// @desc    Get a list of all APPROVED designers (for the consultation form)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const designers = await User.find({ role: 'designer' }).select('name email');
        res.json(designers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- THIS IS THE MISSING ROUTE THAT CAUSED THE 404 ERROR ---
// @route   GET api/designers/pending
// @desc    Get all users who are pending designer approval
// @access  Admin
router.get('/pending', auth, adminOnly, async (req, res) => {
    try {
        // According to your project document, users who can be approved are 'registered' users.
        // In a more advanced version, you might have an 'applicationStatus' field.
        const pendingDesigners = await User.find({ role: 'registered' }).select('-password');
        res.json(pendingDesigners);
    } catch (err) {
        console.error('Error fetching pending designers:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/designers/approve/:id
// @desc    Approve a pending designer by changing their role
// @access  Admin
router.put('/approve/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: 'designer' }, // Change the user's role
            { new: true }         // Return the updated user document
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'Designer approved successfully', user });
    } catch (err) {
        console.error('Error approving designer:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/designers/reject/:id
// @desc    Reject a designer application
// @access  Admin
router.put('/reject/:id', auth, adminOnly, async (req, res) => {
    try {
        // For simplicity, we will just delete the user who applied.
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await user.deleteOne();
        res.json({ msg: 'Designer application rejected and user removed' });
    } catch (err) {
        console.error('Error rejecting designer:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;