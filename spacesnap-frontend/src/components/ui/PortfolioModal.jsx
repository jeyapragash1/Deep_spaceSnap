// src/components/ui/PortfolioModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag } from 'react-icons/fa';

const PortfolioModal = ({ item, onClose }) => {
    // If no item is selected, render nothing
    if (!item) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                >
                    {/* --- Image Section --- */}
                    <div className="w-full md:w-1/2">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* --- Details Section --- */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl z-10">
                            <FaTimes />
                        </button>
                        
                        <h2 className="text-3xl font-bold text-neutral-dark mb-2">{item.title}</h2>
                        <p className="text-md text-gray-500 mb-4">by <span className="font-semibold text-primary-teal">{item.designer}</span></p>

                        <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                            {item.description}
                        </p>

                        <div>
                            <h4 className="font-semibold text-lg mb-3">Key Features:</h4>
                            <div className="flex flex-wrap gap-2">
                                {item.details.map((detail, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                                        <FaTag className="text-gray-400" /> {detail}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PortfolioModal;