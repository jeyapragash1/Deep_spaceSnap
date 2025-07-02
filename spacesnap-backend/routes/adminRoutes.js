// spacesnap-backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// In a real application, you would import Mongoose models for Designs, etc.
// For now, we will return DUMMY data to build the frontend.

// Mock data to simulate content waiting for moderation
const mockContent = [
    { _id: 'content1', type: 'Design Template', author: 'Elena Romanova', status: 'Pending' },
    { _id: 'content2', type: 'Portfolio Image', author: 'John Carter', status: 'Pending' },
    { _id: 'content3', type: 'Blog Post', author: 'Creative Designs Co.', status: 'Pending' },
];

// Mock data for system settings
let mockSettings = {
    siteName: 'SpaceSnap',
    maintenanceMode: false,
    premiumPrice: 1000,
    allowRegistrations: true,
};

// @route   GET api/admin/content/pending
// @desc    Get all content pending moderation
router.get('/content/pending', (req, res) => {
    // In a real app, you would query your database for content where status is 'Pending'
    res.json(mockContent);
});

// @route   PUT api/admin/content/approve/:id
// @desc    Approve a piece of content
router.put('/content/approve/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Approving content with ID: ${id}`);
    // In a real app, you'd find the content by ID and update its status to 'Approved'
    res.json({ msg: 'Content approved successfully' });
});

// @route   DELETE api/admin/content/reject/:id
// @desc    Reject (delete) a piece of content
router.delete('/content/reject/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Rejecting content with ID: ${id}`);
    // In a real app, you'd find the content by ID and delete it
    res.json({ msg: 'Content rejected and removed' });
});

// @route   GET api/admin/settings
// @desc    Get current system settings
router.get('/settings', (req, res) => {
    res.json(mockSettings);
});

// @route   PUT api/admin/settings
// @desc    Update system settings
router.put('/settings', (req, res) => {
    const { siteName, maintenanceMode, premiumPrice, allowRegistrations } = req.body;
    
    // Update our mock settings object
    mockSettings.siteName = siteName ?? mockSettings.siteName;
    mockSettings.maintenanceMode = maintenanceMode ?? mockSettings.maintenanceMode;
    mockSettings.premiumPrice = premiumPrice ?? mockSettings.premiumPrice;
    mockSettings.allowRegistrations = allowRegistrations ?? mockSettings.allowRegistrations;

    console.log('Updated settings:', mockSettings);
    res.json({ msg: 'Settings updated successfully', settings: mockSettings });
});


module.exports = router;