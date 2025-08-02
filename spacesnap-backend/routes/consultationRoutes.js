// spacesnap-backend/routes/consultations.js

const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Design = require('../models/Design');

// @route   POST api/consultations
// @desc    Book a new consultation (User action)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { designerId, subject, message } = req.body;

  if (!designerId || !subject || !message) {
    return res.status(400).json({ msg: 'Designer, subject, and message are required.' });
  }

  try {
    const designer = await User.findById(designerId);
    if (!designer || designer.role !== 'designer') {
      return res.status(404).json({ msg: 'Designer not found.' });
    }

    const newConsultation = new Consultation({
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
        return res.status(400).json({ msg: error.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/consultations/my-consultations
// @desc    Get all consultations for the logged-in user (User action)
// @access  Private
router.get('/my-consultations', authMiddleware, async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.userId })
      .populate('designer', 'name avatar email') 
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    console.error('Error fetching user consultations:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/consultations/designer
// @desc    Get all consultations assigned to the logged-in designer
// @access  Private (Designer Only)
router.get('/designer', authMiddleware, async (req, res) => {
    try {
        const consultations = await Consultation.find({ designer: req.user.userId })
            .populate('user', 'name email avatar') // Get the client's details
            .sort({ createdAt: -1 });

        res.json(consultations);
    } catch (error) {
        console.error('Error fetching designer consultations:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/consultations/designer/:id
// @desc    Update the status of a consultation (e.g., accept, complete)
// @access  Private (Designer Only)
router.put('/designer/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    
    if (!['Accepted', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status update.' });
    }

    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }

        if (consultation.designer.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized to update this consultation.' });
        }

        consultation.status = status;
        await consultation.save();
        
        const updatedConsultation = await Consultation.findById(consultation._id)
                                          .populate('user', 'name email avatar');

        res.json(updatedConsultation);

    } catch (error) {
        console.error('Error updating consultation status:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/consultations/:id
// @desc    Get a single consultation by its ID (for viewing the message thread)
// @access  Private (User or Designer)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('designer', 'name avatar')
            .populate('replies.user', 'name avatar');

        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }

        if (consultation.user._id.toString() !== req.user.userId && consultation.designer._id.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized to view this consultation.' });
        }
        
        res.json(consultation);

    } catch (error) {
        console.error('Error fetching single consultation:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/consultations/:id/reply
// @desc    Add a reply to a consultation
// @access  Private (User or Designer)
router.post('/:id/reply', authMiddleware, async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ msg: 'Message content is required.' });
    }

    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }

        if (consultation.user.toString() !== req.user.userId && consultation.designer.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized to reply to this consultation.' });
        }

        const newReply = {
            user: req.user.userId,
            message: message,
        };

        consultation.replies.push(newReply);
        
        if (consultation.status === 'Pending') {
            const currentUser = await User.findById(req.user.userId);
            if(currentUser.role === 'designer') {
                consultation.status = 'Accepted';
            }
        }

        await consultation.save();
        
        const populatedConsultation = await Consultation.findById(consultation._id)
                                           .populate('user', 'name avatar')
                                           .populate('designer', 'name avatar')
                                           .populate('replies.user', 'name avatar');

        res.status(201).json(populatedConsultation);

    } catch (error) { // --- THIS IS THE FIX: ADDED CURLY BRACES ---
        console.error('Error adding reply:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/consultations/designer/stats
// @desc    Get key stats for the logged-in designer
// @access  Private (Designer Only)
router.get('/designer/stats', authMiddleware, async (req, res) => {
    try {
        const designerId = req.user.userId;

        const [
            pendingCount,
            acceptedCount,
            completedCount,
            contentCount
        ] = await Promise.all([
            Consultation.countDocuments({ designer: designerId, status: 'Pending' }),
            Consultation.countDocuments({ designer: designerId, status: 'Accepted' }),
            Consultation.countDocuments({ designer: designerId, status: 'Completed' }),
            Design.countDocuments({ user: designerId })
        ]);

        res.json({
            pending: pendingCount,
            active: acceptedCount,
            completed: completedCount,
            totalContent: contentCount
        });

    } catch (error) {
        console.error('Error fetching designer stats:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;