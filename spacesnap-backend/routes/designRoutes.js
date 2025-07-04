// routes/designRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // To make sure only logged-in users can save
const Design = require('../models/Design'); // Our Design model

// @route   POST api/designs
// @desc    Save a new design for the logged-in user
// @access  Private
router.post('/', auth, async (req, res) => {
    // The design data will be sent in the request body
    const { name, designData, thumbnail } = req.body;

    try {
        const newDesign = new Design({
            user: req.user.id, // req.user.id comes from our authMiddleware
            name,
            designData, // This will be a JSON string of all the design choices
            thumbnail,
        });

        const savedDesign = await newDesign.save();
        
        // Send back a success message and the saved design object
        res.status(201).json({ msg: 'Design saved successfully!', design: savedDesign });

    } catch (err) {
        console.error('Error saving design:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/designs
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