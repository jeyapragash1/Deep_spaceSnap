// routes/consultationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Consultation = require('../models/Consultation');
const User = require('../models/User');

// @route   POST api/consultations
// @desc    Create a new consultation request
router.post('/', auth, async (req, res) => {
    const { designerId, subject, message } = req.body;
    try {
        const newConsultation = new Consultation({
            user: req.user.id, // The logged-in user making the request
            designer: designerId,
            subject,
            message,
        });

        const consultation = await newConsultation.save();
        res.status(201).json(consultation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/consultations/designer
// @desc    Get all consultations for the logged-in designer
router.get('/designer', auth, async (req, res) => {
    try {
        // Ensure the user is a designer
        const user = await User.findById(req.user.id);
        if(user.role !== 'designer') {
            return res.status(403).json({ msg: 'User is not a designer' });
        }
        
        const consultations = await Consultation.find({ designer: req.user.id }).populate('user', 'name email');
        res.json(consultations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// We can add more routes later (e.g., for a user to see their own requests)

module.exports = router;