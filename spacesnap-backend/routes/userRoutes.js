// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../middleware/authMiddleware');

// === REGISTER with OTP ===
router.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user = new User({ name, email, password, phoneNumber, otp, otpExpire });
    await user.save();
    
    // --- MOCK SMS SENDING ---
    // In a real app, you would use an SMS API like Twilio here.
    // For now, we print it to the console for easy testing.
    console.log(`\n--- OTP FOR ${email} ---`);
    console.log(`--- ${otp} ---`);
    console.log(`-------------------------\n`);

    res.status(201).json({ 
        success: true, 
        msg: 'Registration successful! Please check your console for the OTP.',
        userId: user._id // Send back user ID to use on OTP page
    });
  } catch (err) {
    console.error(err.message); res.status(500).send('Server error');
  }
});

// === VERIFY OTP ===
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: 'User not found.' });

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        
        // After verification, automatically log them in by creating a token
        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message); res.status(500).send('Server Error');
    }
});


// === LOGIN ===
router.post('/login', async (req, res) => { /* ... no changes needed ... */ });

// === FORGOT PASSWORD ===
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User with that email does not exist.' });

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n${resetUrl}`;
        
        try {
            await sendEmail({ email: user.email, subject: 'Password Reset Token', message });
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ msg: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err.message); res.status(500).send('Server error');
    }
});

// === RESET PASSWORD ===
router.put('/resetpassword/:resettoken', async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, msg: 'Password reset successful.' });
    } catch (err) {
        console.error(err.message); res.status(500).send('Server error');
    }
});

// The premium upgrade route from before remains unchanged
router.put('/upgrade-to-premium', authMiddleware, async (req, res) => { /* ... no changes ... */ });

module.exports = router;