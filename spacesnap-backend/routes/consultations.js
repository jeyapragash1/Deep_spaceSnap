// spacesnap-backend/routes/consultations.js

const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/consultations
// @desc    Book a new consultation
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { designerId, subject, message } = req.body;

  if (!designerId || !subject || !message) {
    return res.status(400).json({ msg: 'Designer, subject, and message are required.' });
  }

  // For debugging, you can keep this or remove it
  console.log('User data from token in POST route:', req.user);

  try {
    const designer = await User.findById(designerId);
    if (!designer || designer.role !== 'designer') {
      return res.status(404).json({ msg: 'Designer not found.' });
    }

    const newConsultation = new Consultation({
      // --- THIS IS THE FIX ---
      // Use 'req.user.userId' which matches the payload in your token
      user: req.user.userId, 
      designer: designerId,
      subject,
      message,
    });

    const consultation = await newConsultation.save();
    res.status(201).json(consultation);

  } catch (error) {
    console.error('Error booking consultation:', error.message);
    if (error.name === 'ValidationError') {
        // Send the specific validation error message to the frontend
        return res.status(400).json({ msg: error.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/consultations/my-consultations
// @desc    Get all consultations for the logged-in user
// @access  Private
router.get('/my-consultations', authMiddleware, async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.userId }) // <-- FIX HERE AS WELL
      .populate('designer', 'name avatar email') 
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;