// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Design = require('../models/Design');
const Consultation = require('../models/Consultation');
// We will create the QuizResult model next

// @route   GET api/profile/my-data
// @desc    Get all data for the user dashboard in a single call for efficiency
// @access  Private
router.get('/my-data', auth, async (req, res) => {
    try {
        const designs = await Design.find({ user: req.user.id }).sort({ createdAt: -1 });
        const consultations = await Consultation.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        // Mock Quiz Results for now, as we haven't built the save logic yet
        const quizResults = [
            { _id: 'qr1', style: 'Modern', createdAt: new Date() },
            { _id: 'qr2', style: 'Bohemian', createdAt: new Date(Date.now() - 86400000) },
        ];
        
        res.json({
            designs,
            consultations,
            quizResults
        });
    } catch (err) {
        console.error('Error fetching profile data:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;