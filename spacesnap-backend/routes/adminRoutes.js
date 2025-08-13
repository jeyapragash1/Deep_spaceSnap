// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Design = require('../models/Design');
const EmailTemplate = require('../models/EmailTemplate');
const Setting = require('../models/Setting');
const authMiddleware = require('../middleware/authMiddleware');

// --- Middleware: Admin Only Access ---
const adminOnly = async (req, res, next) => {
  try {
    // This assumes your authMiddleware attaches a user object with a `userId` property.
    const user = await User.findById(req.user.userId); 
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  } catch (err) {
    console.error("Admin check failed:", err.message);
    res.status(500).send('Server Error');
  }
};

// Apply both middlewares to all routes defined in this file.
router.use(authMiddleware, adminOnly);


// ---------- DASHBOARD OVERVIEW ----------
router.get('/stats', async (req, res) => {
  try {
    const [
        totalUsers, 
        totalDesigners, 
        pendingApprovals, 
        totalDesigns
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'designer' }),
        User.countDocuments({ role: 'registered' }),
        Design.countDocuments()
    ]);
    res.json({ totalUsers, totalDesigners, pendingApprovals, totalDesigns });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    res.status(500).send('Server Error');
  }
});


// ---------- USER MANAGEMENT ----------
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// ---------- DESIGNER APPROVAL ----------
router.get('/pending-designers', async (req, res) => {
  try {
    const pending = await User.find({ role: 'registered' }).select('-password');
    res.json(pending);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/approve-designer/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'designer' }, { new: true });
    res.json({ msg: 'Designer approved', user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/reject-designer/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await user.deleteOne();
        res.json({ msg: 'Designer application rejected and user removed' });
    } catch (err) {
        console.error('Error rejecting designer:', err.message);
        res.status(500).send('Server Error');
    }
});


// ---------- CONTENT (DESIGN) MODERATION ----------
router.get('/designs', async (req, res) => {
  try {
    const designs = await Design.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/designs/:id', async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Design deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// ---------- EMAIL TEMPLATES ----------
router.get('/email-templates', async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        res.json(templates);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/email-templates/:id', async (req, res) => {
    const { subject, htmlBody } = req.body;
    try {
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
            req.params.id,
            { subject, htmlBody },
            { new: true }
        );
        res.json(updatedTemplate);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// ---------- SYSTEM SETTINGS & FEATURE FLAGS ----------
router.get('/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne({ key: 'main-settings' }).lean(); // Use .lean() for a plain object
        if (!settings) {
            const newSettings = new Setting();
            await newSettings.save();
            settings = newSettings.toObject();
        }
        
        // --- THIS IS THE MODIFICATION ---
        // Securely remove the secret key before sending settings to the frontend
        if (settings.paymentGateway) {
            delete settings.paymentGateway.stripeSecretKey;
        }
        
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/settings', async (req, res) => {
    const { featureFlags } = req.body;
    try {
        const updatedSettings = await Setting.findOneAndUpdate(
            { key: 'main-settings' },
            { $set: { featureFlags } },
            { new: true, upsert: true }
        );
        res.json(updatedSettings);
    } catch (err) {
        console.error('Error updating settings:', err.message);
        res.status(500).send('Server Error');
    }
});


// --- THIS IS THE NEW CODE ADDED TO YOUR FILE ---
// ---------- PAYMENT GATEWAY SETTINGS ----------
router.put('/payment-settings', async (req, res) => {
    const { stripeEnabled, stripePublishableKey, stripeSecretKey } = req.body;

    try {
        // Construct the update object carefully
        const updatePayload = {
            'paymentGateway.stripeEnabled': stripeEnabled,
            'paymentGateway.stripePublishableKey': stripePublishableKey,
        };
        
        // Only update the secret key if a new one was actually provided
        if (stripeSecretKey && stripeSecretKey !== '••••••••••••••••••••') {
            updatePayload['paymentGateway.stripeSecretKey'] = stripeSecretKey;
        }

        await Setting.findOneAndUpdate(
            { key: 'main-settings' },
            { $set: updatePayload },
            { new: true, upsert: true }
        );
        
        res.json({ msg: 'Payment settings updated successfully!' });
    } catch (err) {
        console.error('Error updating payment settings:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;