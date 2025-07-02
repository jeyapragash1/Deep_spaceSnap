// spacesnap-backend/routes/designerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // We are still using the User model
const auth = require('../middleware/authMiddleware'); // We'll need this later to protect routes

// A helper middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
    // Note: We would get the role from req.user.role after implementing real auth
    // For now, we will assume the check passes. In the future, you'd add:
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ msg: 'Access denied: Admins only' });
    // }
    next();
};

// @route   GET api/designers/pending
// @desc    Get all users who have applied to be designers (e.g., role is 'registered' but has a portfolio)
// @access  Admin
router.get('/pending', auth, adminOnly, async (req, res) => {
    try {
        // For this example, we will just find users with the role 'registered'
        // In a real app, you might have a 'wantsToBeDesigner: true' flag
        const pendingDesigners = await User.find({ role: 'registered' }).select('-password');
        res.json(pendingDesigners);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/designers/approve/:id
// @desc    Approve a designer by changing their role
// @access  Admin
router.put('/approve/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        user.role = 'designer';
        await user.save();
        
        res.json({ msg: 'Designer approved successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/designers/reject/:id
// @desc    Reject a designer (could delete them or set a 'rejected' status)
// @access  Admin
router.put('/reject/:id', auth, adminOnly, async (req, res) => {
    try {
        // For simplicity, we'll just delete the user application
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await user.deleteOne();
        res.json({ msg: 'Designer application rejected and removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;