// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Design = require('../models/Design');
const authMiddleware = require('../middleware/authMiddleware');

// --- Middleware: Admin Only Access ---
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId); 

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Apply both middlewares to all routes defined in this file
router.use(authMiddleware, adminOnly);


// ---------- DASHBOARD OVERVIEW ----------
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDesigners = await User.countDocuments({ role: 'designer' });
    const pendingApprovals = await User.countDocuments({ role: 'registered' });
    const totalDesigns = await Design.countDocuments(); // Added total designs
    
    res.json({ totalUsers, totalDesigners, pendingApprovals, totalDesigns });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// ---------- USER MANAGEMENT ----------
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// ---------- DESIGNER APPROVAL ----------
router.get('/pending-designers', async (req, res) => {
  try {
    const pending = await User.find({ role: 'registered' }).select('-password');
    res.json(pending);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/approve-designer/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'designer' }, { new: true });
    res.json({ msg: 'Designer approved', user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/reject-designer/:id', async (req, res) => {
    try {
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


// ---------- CONTENT (DESIGN) MODERATION ----------
router.get('/designs', async (req, res) => {
  try {
    const designs = await Design.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(designs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/designs/:id', async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Design deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;