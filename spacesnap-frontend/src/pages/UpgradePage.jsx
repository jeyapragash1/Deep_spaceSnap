// src/pages/UpgradePage.jsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, Star } from 'lucide-react';

// This will now correctly load your real publishable key from the .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { updateUserState } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required' 
        });
        
        if (error) {
            setMessage(error.type === "card_error" || error.type === "validation_error" ? error.message : "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const res = await api.post('/payments/success');
                updateUserState(res.data.user);
                setMessage("Payment successful! Redirecting...");
                setTimeout(() => navigate('/user/profile'), 2000);
            } catch (backendError) {
                setMessage("Payment succeeded, but failed to upgrade your account. Please contact support.");
                setIsLoading(false);
            }
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : "Pay Now ($10.00)"}
            </button>
            {message && <div className="mt-4 text-center text-sm font-medium text-red-600">{message}</div>}
        </form>
    );
};

const UpgradePage = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const res = await api.post("/payments/create-payment-intent");
                setClientSecret(res.data.clientSecret);
            } catch (err) {
                console.error("Failed to create payment intent:", err);
                setError("Could not load the payment form. Please refresh the page.");
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
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Full Room Preview Access</span></li>
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Unlimited Saved Designs</span></li>
                    <li className="flex items-center gap-3"><Star className="text-yellow-500" /> <span className="font-medium">Priority Support</span></li>
                </ul>

                <div className="bg-white p-8 rounded-xl shadow-xl border">
                    {error ? (
                        <div className="text-center text-red-600 font-medium">{error}</div>
                    ) : clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-48">
                            <Loader2 className="animate-spin text-blue-600" size={48} />
                            <p className="mt-4 text-gray-600">Initializing secure payment...</p>
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