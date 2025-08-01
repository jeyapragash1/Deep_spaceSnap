// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Design = require('../models/Design');
const auth = require('../middleware/authMiddleware');

// --- Middleware: Admin Only Access ---
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Apply both middlewares to all admin routes
router.use(auth, adminOnly);

//
// ---------- DASHBOARD OVERVIEW ----------
//
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDesigners = await User.countDocuments({ role: 'designer' });
    const pendingApprovals = await User.countDocuments({ role: 'registered' });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');
    
    res.json({ totalUsers, totalDesigners, pendingApprovals, recentUsers });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//
// ---------- USER MANAGEMENT ----------
//
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password,
      role,
      authMethod: 'email',
      isEmailVerified: true,
    });

    await newUser.save();
    res.status(201).json(newUser);
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

//
// ---------- DESIGNER APPROVAL ----------
//
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
    await User.findByIdAndUpdate(req.params.id, { role: 'designer' });
    res.json({ msg: 'Designer approved' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//
// ---------- DESIGN MODERATION ----------
//
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
