// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST api/payments/create-payment-intent
// @desc    Create a payment intent for upgrading to premium
// @access  Private
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
    try {
        // In a real application, you would have different amounts for different products.
        // For now, let's hardcode the "Upgrade to Premium" price, e.g., $10.00
        // Stripe requires the amount in the smallest currency unit (e.g., cents).
        const amountInCents = 1000; // $10.00

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Send the clientSecret back to the frontend
        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).send({ error: { message: error.message } });
    }
});


// @route   POST api/payments/success
// @desc    Confirm payment was successful and upgrade user role
// @access  Private
router.post('/success', authMiddleware, async (req, res) => {
    try {
        // Find the user by their ID from the auth token
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        // Update the user's role to 'premium'
        user.role = 'premium';
        await user.save();

        console.log(`User ${user.email} successfully upgraded to premium.`);
        
        // Send back the updated user object
        res.json({
            msg: 'Payment successful! User upgraded to premium.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error upgrading user after payment:", error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;