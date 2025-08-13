// src/components/ui/PortfolioModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag } from 'react-icons/fa';

const PortfolioModal = ({ item, onClose }) => {
    // If no item is selected, render nothing
    if (!item) return null;

    return (
        <AnimatePresence>
            {/* The overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose} // Allow closing by clicking the background
                className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            >
                {/* The modal content */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
                    className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative"
                >
                    {/* --- Close Button --- */}
                    <button onClick={onClose} className="absolute top-3 right-3 text-white md:text-gray-500 bg-black bg-opacity-20 md:bg-transparent rounded-full p-1 hover:bg-opacity-40 transition-colors z-10">
                        <FaTimes size={20} />
                    </button>
                    
                    {/* --- Image Section --- */}
                    <div className="w-full md:w-1/2 bg-gray-100">
                        <img src={item.image.url} alt={item.title} className="w-full h-64 md:h-full object-cover" />
                    </div>

                    {/* --- Details Section --- */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col">
                        
                        <h2 className="text-3xl font-bold text-neutral-dark mb-2">{item.title}</h2>
                        <p className="text-md text-gray-500 mb-4">by <span className="font-semibold text-primary-teal">{item.designer}</span></p>

                        <p className="text-gray-700 leading-relaxed mb-6 flex-grow overflow-y-auto">
                            {item.description}
                        </p>

                        <div>
                            <h4 className="font-semibold text-lg mb-3">Key Features:</h4>
                            <div className="flex flex-wrap gap-2">
                                {item.details && item.details.map((detail, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                                        <FaTag className="text-gray-400" /> {detail}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div> {/* <-- THIS IS THE MISSING CLOSING TAG */}
        </AnimatePresence>
    );
};

export default PortfolioModal;