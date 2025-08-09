// spacesnap-backend/routes/designs.js

const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const authMiddleware = require('../middleware/authMiddleware'); // Your working middleware

// This file handles all requests starting with '/api/designs'

// POST / - Create a new design
// This route is protected. Only logged-in users can create designs.
router.post('/', authMiddleware, async (req, res) => {
    const { name, designData, thumbnail, originalImage } = req.body;
    
    // For debugging, let's see what the middleware gives us
    console.log('User data from token in POST route:', req.user);

    try {
        const newDesign = new Design({
            name,
            designData,
            thumbnail,
            originalImage,
            user: req.user.id, // <-- This 'id' comes directly from the token payload
        });

        const design = await newDesign.save();
        res.status(201).json(design); // Use 201 for resource creation
    } catch (err) {
        console.error("Error saving design:", err.message);
        res.status(500).send('Server Error');
    }
});

// GET /mydesigns - Get all designs for the currently logged-in user
router.get('/mydesigns', authMiddleware, async (req, res) => {
    try {
        const designs = await Design.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(designs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /:id - Get a specific design by its ID
router.get('/:id', authMiddleware, async (req, res) => {
     try {
        const design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ msg: 'Design not found' });
        
        // Security check: ensure the user owns this design
        if (design.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(design);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /:id - Update a specific design
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ msg: 'Design not found' });

        if (design.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        const updatedDesign = await Design.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedDesign);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;