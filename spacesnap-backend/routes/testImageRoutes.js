const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  res.json({ message: 'Image routes are working!' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

module.exports = router;