// spacesnap-backend/routes/portfolioRoutes.js

const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- PUBLIC ROUTE ---
router.get('/', async (req, res) => {
    try {
        const items = await PortfolioItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error("Error fetching portfolio items:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- ADMIN-ONLY ROUTES ---

// POST /api/portfolio - Create a new portfolio item
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden: Admin access required' });
        }

        const { title, designer, style, description, details } = req.body;
        if (!req.file) {
            return res.status(400).json({ msg: 'Image is required' });
        }

        // --- THIS IS THE FIX ---
        // We wrap the Cloudinary callback in a try/catch block to prevent unhandled promise rejections.
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "portfolio" }, async (error, result) => {
            try {
                // If Cloudinary itself returns an error (e.g., bad API key)
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    // Send a specific error message instead of crashing
                    return res.status(500).json({ msg: 'Image upload to cloud failed. Please check server configuration.' });
                }
                
                const newItem = new PortfolioItem({
                    title,
                    designer,
                    style,
                    description,
                    details: details.split(',').map(item => item.trim()),
                    image: { public_id: result.public_id, url: result.secure_url }
                });

                const savedItem = await newItem.save();
                res.status(201).json(savedItem);

            } catch (dbError) {
                // Catch errors from saving to the database
                console.error("Database save error after upload:", dbError.message);
                res.status(500).send('Server Error while saving item.');
            }
        });

        uploadStream.end(req.file.buffer);

    } catch (err) {
        // Catch initial errors (like the admin check failing)
        console.error("Error in POST /api/portfolio route:", err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/portfolio/:id - Delete a portfolio item
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden: Admin access required' });
        }
        
        const item = await PortfolioItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        await cloudinary.uploader.destroy(item.image.public_id);
        await item.deleteOne();
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error("Error deleting portfolio item:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;