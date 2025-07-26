const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/images/upload - Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { name, category, subcategory, description, tags } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    // Process image with Sharp for optimization
    let processedBuffer = req.file.buffer;
    let width, height;

    if (req.file.mimetype !== 'image/svg+xml') {
      const processed = await sharp(req.file.buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      const metadata = await sharp(processed).metadata();
      processedBuffer = processed;
      width = metadata.width;
      height = metadata.height;
    }

    // Convert to base64
    const base64Data = processedBuffer.toString('base64');

    // Create image document
    const image = new Image({
      name,
      category,
      subcategory,
      description,
      data: base64Data,
      contentType: req.file.mimetype !== 'image/svg+xml' ? 'image/jpeg' : req.file.mimetype,
      size: processedBuffer.length,
      width,
      height,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: image._id,
      name: image.name,
      url: `/api/images/${image.name}`
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Image with this name already exists' });
    }
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// POST /api/images/upload-multiple - Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploadedImages = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const { category, subcategory, description } = req.body;
      
      try {
        // Generate name from filename if not provided
        const name = req.body[`names[${i}]`] || file.originalname.split('.')[0];

        // Process image
        let processedBuffer = file.buffer;
        let width, height;

        if (file.mimetype !== 'image/svg+xml') {
          const processed = await sharp(file.buffer)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          
          const metadata = await sharp(processed).metadata();
          processedBuffer = processed;
          width = metadata.width;
          height = metadata.height;
        }

        const base64Data = processedBuffer.toString('base64');

        const image = new Image({
          name,
          category,
          subcategory,
          description,
          data: base64Data,
          contentType: file.mimetype !== 'image/svg+xml' ? 'image/jpeg' : file.mimetype,
          size: processedBuffer.length,
          width,
          height
        });

        await image.save();
        uploadedImages.push({
          name: image.name,
          url: `/api/images/${image.name}`
        });

      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: 'Images processed',
      uploaded: uploadedImages,
      errors: errors
    });

  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

// GET /api/images/:name - Get image by name
router.get('/:name', async (req, res) => {
  try {
    const image = await Image.findOne({ name: req.params.name });
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Convert base64 back to buffer
    const imageBuffer = Buffer.from(image.data, 'base64');

    // Set appropriate headers
    res.set({
      'Content-Type': image.contentType,
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    res.send(imageBuffer);

  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
});

// GET /api/images - Get all images with filtering
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, limit = 50, skip = 0 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const images = await Image.find(filter, {
      data: 0 // Exclude base64 data from list view
    })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .sort({ createdAt: -1 });

    const total = await Image.countDocuments(filter);

    const imagesWithUrls = images.map(image => ({
      ...image.toObject(),
      url: `/api/images/${image.name}`
    }));

    res.json({
      images: imagesWithUrls,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Error retrieving images' });
  }
});

// DELETE /api/images/:name - Delete image (admin only)
router.delete('/:name', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const image = await Image.findOneAndDelete({ name: req.params.name });
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// PUT /api/images/:name - Update image metadata (admin only)
router.put('/:name', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { description, tags, subcategory } = req.body;
    
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    if (subcategory !== undefined) updateData.subcategory = subcategory;

    const image = await Image.findOneAndUpdate(
      { name: req.params.name },
      updateData,
      { new: true, select: '-data' }
    );
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      message: 'Image updated successfully',
      image: {
        ...image.toObject(),
        url: `/api/images/${image.name}`
      }
    });

  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Error updating image' });
  }
});

module.exports = router;