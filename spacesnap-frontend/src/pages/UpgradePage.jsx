// src/pages/UpgradePage.jsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, Star } from 'lucide-react';

// IMPORTANT: Replace this with your own Stripe Publishable Key from your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- The Checkout Form Component ---
const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { updateUserState } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // We don't need a return_url as we handle success manually below
            },
            redirect: 'if_required' // This prevents the default redirect
        });
        
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
        } else {
            // Payment was successful! Now, notify our backend to upgrade the user.
            try {
                const res = await api.post('/payments/success');
                // Update the global user state with the new 'premium' role
                updateUserState(res.data.user);
                setMessage("Payment successful! Redirecting to your dashboard...");
                
                // Redirect to the dashboard after a short delay
                setTimeout(() => {
                    navigate('/user/profile');
                }, 2000);

            } catch (backendError) {
                setMessage("Payment was successful, but we failed to upgrade your account. Please contact support.");
                setIsLoading(false);
            }
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                <span id="button-text">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Pay Now ($10.00)"}
                </span>
            </button>
            {message && <div id="payment-message" className="mt-4 text-center text-red-500">{message}</div>}
        </form>
    );
};


// --- The Main Upgrade Page Component ---
const UpgradePage = () => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        const createPaymentIntent = async () => {
            try {
                const res = await api.post("/payments/create-payment-intent");
                setClientSecret(res.data.clientSecret);
            } catch (error) {
                console.error("Failed to create payment intent:", error);
                // You could show an error message to the user here
            }
        };
        createPaymentIntent();
    }, []);
    
    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Upgrade to Premium</h1>
                    <p className="mt-2 text-gray-600">Unlock all features and take your designs to the next level.</p>
                </div>
                
                <ul className="bg-white p-6 rounded-xl shadow border space-y-3">
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Full AR Preview Access</span></li>
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Unlimited Saved Designs</span></li>
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Priority Support</span></li>
                </ul>

                <div className="bg-white p-8 rounded-xl shadow-xl border">
                    {clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    ) : (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="animate-spin text-blue-600" size={48} />
                        </div>
                    )}
                </div>
                 <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} /> Secure payment powered by Stripe.
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;