// src/components/ui/PaymentModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCreditCard, FaLock } from 'react-icons/fa';
import Button from '../common/Button';

const PaymentModal = ({ isOpen, onClose, onConfirm, title, description, amount, isLoading }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(); // Tell the parent component to handle the successful payment logic
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">×</button>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-neutral-dark">{title}</h2>
                        <p className="text-gray-600 mt-2 mb-4">{description}</p>
                        <p className="text-4xl font-bold text-primary-teal mb-6">${amount}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <FaCreditCard className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="text" placeholder="Card Number" minLength="16" maxLength="16" required className="w-full pl-10 pr-3 py-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <input type="text" placeholder="MM / YY" required className="w-full px-3 py-2 border rounded-md" />
                            <input type="text" placeholder="CVC" minLength="3" maxLength="3" required className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <Button type="submit" className="w-full py-3 text-lg flex items-center justify-center gap-3" disabled={isLoading}>
                            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaLock />}
                            {isLoading ? 'Processing...' : `Pay $${amount} Securely`}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;