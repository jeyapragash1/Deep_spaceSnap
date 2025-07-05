// routes/designRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Design = require('../models/Design');
const User = require('../models/User');

// A helper middleware to check if the user is a designer or admin
const designerOrAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role !== 'designer' && user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Designers or Admins only' });
    }
    next();
};

// @route   POST api/designs
// @desc    Create a new design template (for designers)
// @access  Private (Designer or Admin)
router.post('/', auth, designerOrAdmin, async (req, res) => {
    const { name, description, style, price, thumbnail } = req.body;

    try {
        const newDesign = new Design({
            user: req.user.id, // The designer creating the template
            name,
            // For a real app, 'designData' would be a complex JSON object.
            // For a template, we can store metadata.
            designData: JSON.stringify({ description, style, price }),
            // The frontend will send a thumbnail URL.
            thumbnail: thumbnail || 'https://source.unsplash.com/random/400x300?interior,design',
        });

        const savedDesign = await newDesign.save();
        res.status(201).json(savedDesign);

    } catch (err) {
        console.error('Error saving design template:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/designs/my-designs
// @desc    Get all designs for the logged-in designer
// @access  Private (Designer)
router.get('/my-designs', auth, async (req, res) => {
    try {
        const designs = await Design.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(designs);
    } catch (err) {
        console.error('Error fetching designs:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/designs/:id
// @desc    Delete a design
// @access  Private (Designer or Admin)
router.delete('/:id', auth, designerOrAdmin, async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ msg: 'Design not found' });

        // Ensure the user owns the design before deleting
        if (design.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await design.deleteOne();
        res.json({ msg: 'Design removed' });
    } catch (err) {
        console.error('Error deleting design:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;