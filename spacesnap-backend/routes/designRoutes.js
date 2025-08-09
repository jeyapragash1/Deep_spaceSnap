// routes/designRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Design = require('../models/Design');

// @route   POST /api/designs
// @desc    Save a new design
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, designData, thumbnail } = req.body;

  try {
    const newDesign = new Design({
      user: req.user.id,
      name,
      designData,
      thumbnail,
    });

    const savedDesign = await newDesign.save();
    res.status(201).json({ msg: 'Design saved successfully!', design: savedDesign });
  } catch (err) {
    console.error('Error saving design:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/designs
// @desc    Get all designs for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    console.error('Error fetching designs:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
