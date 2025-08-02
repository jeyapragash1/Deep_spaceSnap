// spacesnap-backend/routes/designs.js

const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const User = require('../models/User'); // Import User model for role checking
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/designs
// @desc    Create a new design (for any logged-in user)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { name, designData, thumbnail, originalImage } = req.body;
    
    try {
        const newDesign = new Design({
            name,
            designData,
            thumbnail,
            originalImage,
            user: req.user.userId, // Using userId from your token payload
        });

        const design = await newDesign.save();
        res.status(201).json(design);
    } catch (err) {
        console.error("Error saving design:", err.message);
        res.status(500).send('Server Error');
    }
});

// ... (at the end of your designs.js file)

// @route   DELETE api/designs/:id
// @desc    Delete a design
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);

        if (!design) {
            return res.status(404).json({ msg: 'Design not found' });
        }

        // Security check: Make sure the user deleting the design is the one who created it
        if (design.user.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized to delete this design' });
        }

        await design.deleteOne();

        res.json({ msg: 'Design removed successfully' });

    } catch (err) {
        console.error("Error deleting design:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/designs/mydesigns
// @desc    Get all designs for the currently logged-in user
// @access  Private
router.get('/mydesigns', authMiddleware, async (req, res) => {
    try {
        const designs = await Design.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(designs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/designs/:id
// @desc    Get a specific design by its ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
     try {
        const design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ msg: 'Design not found' });
        
        // Security check: ensure the user owns this design
        if (design.user.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(design);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/designs/:id
// @desc    Update a specific design
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ msg: 'Design not found' });

        if (design.user.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        const updatedDesign = await Design.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedDesign);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ========================================================================
// --- NEW ROUTE FOR DESIGNER DASHBOARD ---
// ========================================================================
// @route   GET api/designs/designer/my-creations
// @desc    Get all designs created by the logged-in designer
// @access  Private (Designer Only)
router.get('/designer/my-creations', authMiddleware, async (req, res) => {
    try {
        // First, check if the user making the request is actually a designer
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'designer') {
            return res.status(403).json({ msg: 'Access denied. Designer role required.' });
        }

        // Fetch all designs where the 'user' field matches the designer's ID
        const designs = await Design.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(designs);
    } catch (err) {
        console.error("Error fetching designer's creations:", err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;