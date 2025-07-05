// src/pages/UpgradePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaRocket } from 'react-icons/fa';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/ui/PaymentModal';

const UpgradePage = () => {
    const navigate = useNavigate();
    const { updateUserToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await axios.put('http://localhost:5000/api/users/upgrade-to-premium', {});
            updateUserToken(res.data.token);
            alert('Upgrade successful! Welcome to Premium.');
            setIsModalOpen(false);
            navigate('/dashboard');
        } catch (err) {
            alert('Upgrade failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmUpgrade} title="Confirm Premium Upgrade" description="Complete the payment to unlock all features." amount={1000} isLoading={isLoading}/>
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-2xl text-center">
                    <FaRocket className="text-6xl text-primary-teal mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold text-neutral-dark mb-2">Upgrade to SpaceSnap Premium</h1>
                    <p className="text-lg text-gray-600 mb-6">Unlock a world of design possibilities.</p>
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <ul className="space-y-2 text-gray-700 text-left mb-6">
                            <li className="flex items-center gap-2">✓ Unlimited AI Visualizations</li>
                            <li className="flex items-center gap-2">✓ Full Access to AR Preview</li>
                            <li className="flex items-center gap-2">✓ Save and Share Unlimited Designs</li>
                        </ul>
                        <Button onClick={() => setIsModalOpen(true)} className="w-full py-3 text-lg flex items-center justify-center gap-3">
                            <FaLock /> Proceed to Payment
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpgradePage;