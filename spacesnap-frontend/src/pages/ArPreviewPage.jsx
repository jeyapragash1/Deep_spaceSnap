// src/pages/ArPreviewPage.jsx

import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCube, FaCamera } from 'react-icons/fa';

// --- LOCAL IMAGE IMPORTS ---
// We'll use your local images to showcase the models
import imgSofa from '../assets/images/sofa.webp';
import imgPlant from '../assets/images/plant.jpg';
import imgLamp from '../assets/images/pendant-light.jpg'; // Assuming you have a lamp image

// --- DATA FOR THE FEATURED MODELS ---
const featuredModels = [
    {
        name: 'Modern Sofa',
        category: 'Seating',
        image: imgSofa
    },
    {
        name: 'Potted Plant',
        category: 'Decor',
        image: imgPlant
    },
    {
        name: 'Pendant Lamp',
        category: 'Lighting',
        image: imgLamp
    },
];

const ArPreviewPage = () => {
    return (
        <MainLayout>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">

                    {/* --- HEADER SECTION --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <FaCube className="text-primary-teal text-6xl mx-auto mb-4" />
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">
                            View in Your Room (AR)
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Stop guessing. Start seeing. Use your phone's camera to place true-to-scale 3D models of furniture and decor right in your own space.
                        </p>
                    </motion.div>

                    {/* --- HOW IT WORKS SECTION --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                        <div className="p-6">
                            <FaMobileAlt className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">1. Open on Mobile</h3>
                            <p className="text-gray-600">This feature uses your device's camera, so it works best on a smartphone or tablet.</p>
                        </div>
                        <div className="p-6">
                            <FaCamera className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">2. Scan Your Room</h3>
                            <p className="text-gray-600">Point your camera at the floor to allow the technology to detect your physical space.</p>
                        </div>
                        <div className="p-6">
                            <FaCube className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">3. Place 3D Objects</h3>
                            <p className="text-gray-600">Select an item from our library and tap on your screen to place it in your room.</p>
                        </div>
                    </div>
                    
                    {/* --- FEATURED MODELS SHOWCASE --- */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-dark text-center mb-8">Featured 3D Models</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredModels.map((model, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden group"
                                >
                                    <div className="overflow-hidden">
                                        <img src={model.image} alt={model.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500">{model.category}</p>
                                        <h3 className="text-xl font-semibold text-neutral-dark">{model.name}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- CALL TO ACTION --- */}
                    <div className="bg-primary-teal text-white text-center p-10 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to Try It?</h2>
                        <p className="mb-6">If you're on a mobile device, tap the button below to launch the AR experience.</p>
                        <button 
                            className="bg-accent-gold text-white font-bold text-xl px-10 py-4 rounded-lg transform hover:scale-105 transition-transform"
                            // In a real app, this onClick would trigger the WebXR or AR.js library
                            onClick={() => alert("Launching AR Mode... (This requires a mobile device and camera permissions)")}
                        >
                            Launch AR Preview
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default ArPreviewPage;