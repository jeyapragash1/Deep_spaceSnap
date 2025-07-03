// src/pages/ArPreviewPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCube, FaCamera } from 'react-icons/fa';

// --- A-FRAME AND MINDAR IMPORTS ---
// We need to import these to make the AR components available.
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';


// --- THE LIVE AR VIEW COMPONENT ---
// This component will only be rendered when the user enters AR mode.
const ArScene = ({ modelSrc }) => {
    const sceneRef = useRef(null);
  
    useEffect(() => {
        // This effect runs when the component mounts.
        // It starts the MindAR engine and shows the camera feed.
        const sceneEl = sceneRef.current;
        const arSystem = sceneEl.systems["mindar-image-system"];
        
        sceneEl.addEventListener('renderstart', () => {
            arSystem.start(); // start AR camera
        });
        
        // This is a cleanup function that runs when the component is unmounted.
        return () => {
            arSystem.stop(); // stop AR camera
        };
    }, []);
  
    return (
      <a-scene
        ref={sceneRef}
        // This sets up the MindAR engine for "Image Tracking".
        // The 'targetSrc' would point to a .mind file for a specific image marker.
        // For a simple "see it in your room" demo, we can start it without a marker.
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind;"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets>
            {/* The 3D model is loaded here */}
            <a-asset-item id="model" src={modelSrc}></a-asset-item>
        </a-assets>
  
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        
        {/* This entity is the trackable marker. When it sees the target image, it becomes visible. */}
        <a-entity mindar-image-target="targetIndex: 0">
            {/* This is our 3D model */}
            <a-gltf-model
                rotation="0 0 0"
                position="0 0 0.1"
                scale="0.2 0.2 0.2"
                src="#model"
                animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
            ></a-gltf-model>
        </a-entity>
      </a-scene>
    );
  };
  

// --- THE MAIN PAGE COMPONENT ---
const ArPreviewPage = () => {
    // State to control which view is active
    const [arModeActive, setArModeActive] = useState(false);
    // State to hold the path to the selected 3D model
    const [selectedModel, setSelectedModel] = useState('');

    const launchArMode = (modelPath) => {
        setSelectedModel(modelPath);
        setArModeActive(true);
    };

    // If AR mode is active, we render ONLY the AR scene.
    if (arModeActive) {
        return <ArScene modelSrc={selectedModel} />;
    }
    
    // Otherwise, we render the introductory page inside the MainLayout.
    return (
        <MainLayout>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <FaCube className="text-primary-teal text-6xl mx-auto mb-4" />
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">
                            Augmented Reality Preview
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Stop guessing if it fits. Use your phone's camera to place true-to-scale 3D models right in your room.
                        </p>
                    </motion.div>

                    <div className="text-center p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md mb-12">
                        <FaMobileAlt className="inline-block mr-3 text-2xl" />
                        For the best experience, please use a modern smartphone.
                    </div>

                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-dark text-center mb-8">Select a Model to Preview</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            
                            {/* Card for the Sofa Model */}
                            <div className="w-full sm:w-64 text-center">
                                <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-4">
                                    <p className="font-semibold">3D Model: Sofa</p>
                                </div>
                                <button 
                                    onClick={() => launchArMode('/models/sofa.glb')}
                                    className="w-full bg-primary-teal text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform hover:scale-105"
                                >
                                    Launch in AR
                                </button>
                            </div>
                            
                            {/* You can add more cards for other models here */}
                            
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ArPreviewPage;