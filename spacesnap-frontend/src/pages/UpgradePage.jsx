// src/pages/UpgradePage.jsx
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaLock, FaRocket } from 'react-icons/fa';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext'; // We need this to update the token

const UpgradePage = () => {
    const navigate = useNavigate();
    const { updateUserToken } = useAuth(); // We'll create this new function in AuthContext
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // In a real app, you would process the payment with Stripe here.
        // For our mock flow, we just simulate a delay.
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Get the current token from local storage to authorize the request
            const token = localStorage.getItem('spaceSnapToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            
            // Call our new backend endpoint
            const res = await axios.put('http://localhost:5000/api/users/upgrade-to-premium', {}, config);

            // IMPORTANT: Update the token in local storage and in our auth context
            updateUserToken(res.data.token);

            // Redirect to the dashboard where they will now have premium access
            navigate('/dashboard');

        } catch (err) {
            setError('Something went wrong with the upgrade. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-2xl text-center">
                    <FaRocket className="text-6xl text-primary-teal mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold text-neutral-dark mb-2">Upgrade to SpaceSnap Premium</h1>
                    <p className="text-lg text-gray-600 mb-6">Unlock a world of design possibilities.</p>

                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <div className="text-left mb-6">
                            <h2 className="text-2xl font-bold mb-3">One-Time Payment</h2>
                            <p className="text-5xl font-bold text-primary-teal mb-4">₹1000 <span className="text-lg font-normal text-gray-500">/ lifetime access</span></p>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center gap-2">✓ Unlimited AI Visualizations</li>
                                <li className="flex items-center gap-2">✓ Full Access to AR Preview</li>
                                <li className="flex items-center gap-2">✓ Save and Share Unlimited Designs</li>
                                <li className="flex items-center gap-2">✓ Priority Support</li>
                            </ul>
                        </div>
                        
                        {/* Mock Payment Form */}
                        <form onSubmit={handlePaymentSubmit}>
                            <h3 className="font-bold text-lg mb-4 text-left">Secure Payment</h3>
                            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

                            <div className="mb-4 relative">
                                <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
                                <input type="text" placeholder="Card Number" className="w-full pl-10 pr-3 py-2 border rounded-md" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <input type="text" placeholder="MM / YY" className="w-full px-3 py-2 border rounded-md" required />
                                <input type="text" placeholder="CVC" className="w-full px-3 py-2 border rounded-md" required />
                            </div>
                            
                            <Button type="submit" className="w-full py-3 text-lg flex items-center justify-center gap-3" disabled={isLoading}>
                                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaLock />}
                                {isLoading ? 'Processing Payment...' : 'Pay ₹1000 Securely'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UpgradePage;