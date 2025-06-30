// src/pages/AiVisualizerPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import aiVisualizerService from '../services/aiVisualizerService'; // Our Mock AI
import { colorPalettes, furnitureSuggestions } from '../data/designData';
import { FaPalette, FaCouch, FaSpinner, FaMagic } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AiVisualizerPage = () => {
    const location = useLocation();

    // --- STATE MANAGEMENT ---
    // The original image file uploaded by the user
    const [originalImage, setOriginalImage] = useState(null);
    // URL for the uploaded image to display it
    const [imagePreview, setImagePreview] = useState(null);
    // The suggested style from the quiz (e.g., 'modern')
    const [suggestedStyle, setSuggestedStyle] = useState('default');
    // The color palettes to show the user
    const [palettes, setPalettes] = useState(colorPalettes.default);
    // The current color selected by the user for the walls
    const [selectedWallColor, setSelectedWallColor] = useState('#FFFFFF');
    // The mask for the walls returned by our "AI"
    const [wallMask, setWallMask] = useState(null);
    // State to show a loading screen while the "AI" is working
    const [isProcessing, setIsProcessing] = useState(false);
    // State to track if the visualization is complete
    const [isVisualized, setIsVisualized] = useState(false);

    // --- LIFECYCLE HOOKS ---
    // This runs once when the page loads to get the quiz summary
    useEffect(() => {
        const quizStyle = location.state?.suggestedStyle;
        if (quizStyle && colorPalettes[quizStyle]) {
            console.log(`Received style from quiz: ${quizStyle}`);
            setSuggestedStyle(quizStyle);
            setPalettes(colorPalettes[quizStyle]);
            setSelectedWallColor(colorPalettes[quizStyle][0]); // Set initial color
        }
    }, [location.state]);

    // --- HANDLER FUNCTIONS ---
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setOriginalImage(file);
            setImagePreview(URL.createObjectURL(file));
            // Reset previous results
            setIsVisualized(false);
            setWallMask(null);
        }
    };

    const handleVisualizeClick = async () => {
        if (!originalImage) {
            alert("Please upload an image first.");
            return;
        }
        setIsProcessing(true);
        setIsVisualized(false);
        try {
            // Call our mock AI service
            const result = await aiVisualizerService.segmentRoom(originalImage);
            setWallMask(result.wallMask); // Store the "mask"
            setIsVisualized(true); // Show the result
        } catch (error) {
            console.error("Error during visualization:", error);
            alert("Something went wrong during the visualization process.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    // --- RENDER LOGIC ---
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-teal mb-4">AI Room Visualizer</h1>
                    <p className="text-lg text-gray-700">See your design ideas come to life instantly.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- Left Side: Control Panel --- */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-neutral-dark mb-4">1. Upload Your Room</h2>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-teal file:text-white hover:file:bg-opacity-90"/>
                        
                        <hr className="my-6" />

                        <h2 className="text-2xl font-bold text-neutral-dark mb-4">2. Choose a Wall Color</h2>
                        <p className="text-sm text-gray-600 mb-2">Based on your <span className="font-bold capitalize">{suggestedStyle}</span> style profile:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {palettes.map(color => (
                                <button key={color} onClick={() => setSelectedWallColor(color)} style={{ backgroundColor: color }} className={`w-10 h-10 rounded-full border-2 ${selectedWallColor === color ? 'border-primary-teal scale-110' : 'border-transparent'}`}></button>
                            ))}
                        </div>

                        {/* We can add a furniture section here later */}

                        <hr className="my-6" />

                        <button onClick={handleVisualizeClick} disabled={isProcessing || !originalImage} className="w-full bg-accent-gold text-white font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center gap-3 disabled:bg-gray-400">
                            {isProcessing ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                            {isProcessing ? 'Analyzing Your Room...' : 'Visualize!'}
                        </button>
                    </div>

                    {/* --- Right Side: Image Display --- */}
                    <div className="bg-gray-200 p-6 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
                        {!imagePreview && <p className="text-gray-500">Your room image will appear here</p>}
                        
                        {/* The visualization result area */}
                        {imagePreview && (
                            <div className="relative w-full h-full">
                                <img src={imagePreview} alt="Your Room" className="w-full h-full object-contain rounded-md" />
                                
                                {/* This SVG overlay is our "AI" result. It paints the color over the wall. */}
                                {isVisualized && wallMask && (
                                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
                                        <path 
                                            d={wallMask} 
                                            fill={selectedWallColor} 
                                            style={{ mixBlendMode: 'multiply' }} // This blend mode makes it look realistic
                                            className="animate-fadeIn"
                                        />
                                    </svg>
                                )}
                            </div>
                        )}
                        
                        {/* Loading Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white rounded-lg">
                                <FaSpinner className="animate-spin text-5xl mb-4" />
                                <p className="text-lg font-semibold">Our AI is redesigning your space...</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* The iterative feedback section you wanted */}
                {isVisualized && (
                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="mt-8 bg-white p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-2xl font-bold text-neutral-dark mb-3">What do you think?</h3>
                        <p className="text-gray-600 mb-4">Not quite right? Just pick a different color and the design will update instantly!</p>
                        <p className="text-sm text-gray-500">You can also add furniture or move to the next feature: AR Preview.</p>
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
};

export default AiVisualizerPage;