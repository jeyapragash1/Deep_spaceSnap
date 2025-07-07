// routes/consultationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Consultation = require('../models/Consultation');
const User = require('../models/User');

// @route   POST api/consultations
// @desc    Create a new consultation request
router.post('/', auth, async (req, res) => { /* ... existing code is correct ... */ });


// @route   GET api/consultations/designer
// @desc    Get all consultations FOR a designer
router.get('/designer', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'designer') {
            return res.status(403).json({ msg: 'User is not a designer' });
        }
        const consultations = await Consultation.find({ designer: req.user.id }).populate('user', 'name email');
        res.json(consultations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- THIS IS THE NEW ROUTE ---
// @route   GET api/consultations/myconsultations
// @desc    Get all consultations created BY a user
// @access  Private
router.get('/myconsultations', auth, async (req, res) => {
    try {
        const consultations = await Consultation.find({ user: req.user.id }).populate('designer', 'name email');
        res.json(consultations);
    } catch (err) {
        console.error('Error fetching user consultations:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;