// src/pages/ArPreviewPage.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaCube, FaCamera, FaCheckCircle, FaMagic, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- CameraCapture Component ---
const CameraCapture = ({ onComplete }) => {
    const videoRef = useRef(null); const canvasRef = useRef(null);
    useEffect(() => {
        let stream; let captureTimer; let sessionTimer;
        const capturedImages = [];
        async function setupCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) { videoRef.current.srcObject = stream; }
                captureTimer = setInterval(captureImage, 2000);
                sessionTimer = setTimeout(stopCamera, 10000);
            } catch (err) { console.error(err); alert("Could not access the camera."); onComplete([]); }
        }
        const captureImage = () => { if (videoRef.current && canvasRef.current) { const v = videoRef.current; const c = canvasRef.current; c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0, c.width, c.height); capturedImages.push(c.toDataURL('image/jpeg')); console.log(`Captured image ${capturedImages.length}`); } };
        const stopCamera = () => { if (stream) { stream.getTracks().forEach(t => t.stop()); } clearInterval(captureTimer); clearTimeout(sessionTimer); onComplete(capturedImages); };
        setupCamera();
        return () => { if (stream) { stream.getTracks().forEach(t => t.stop()); } clearInterval(captureTimer); clearTimeout(sessionTimer); };
    }, [onComplete]);
    return ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}> <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}></video> <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }} className="bg-black bg-opacity-60 text-white p-6 rounded-lg text-center pointer-events-none"> <FaCamera className="text-4xl mx-auto mb-3" /> <h3 className="text-xl font-bold">Scanning Room...</h3> <p>Move your phone slowly.</p></div> </div> );
};

// --- THIS IS THE FINAL COMPONENT WITH THE DATA FORMAT FIX ---
const FinalStepComponent = ({ selectedImage }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true); setError(''); setResultImage(null);
        const apiKey = import.meta.env.VITE_SEGMIND_API_KEY;
        if (!apiKey) { setError("Segmind API key is not configured in .env file."); setIsLoading(false); return; }

        try {
            // --- THIS IS THE CRITICAL FIX ---
            const base64Image = selectedImage.split(',')[1];
            // --- END OF FIX ---

            const response = await fetch('https://api.segmind.com/v1/sd1.5-img2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    "image": base64Image, // Send just the base64 part
                    "prompt": "photorealistic, a beautiful and aesthetic new version of this scene, high quality, 8k",
                    "negative_prompt": "ugly, tiling, poorly drawn, disfigured, deformed, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft",
                    "scheduler": "DDIM",
                    "num_inference_steps": 25,
                    "guidance_scale": 7.5,
                    "strength": 0.75, // How much to change the original image (0.1 to 1.0)
                    "seed": Math.floor(Math.random() * 1000000000)
                }),
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setResultImage(imageUrl);
            } else {
                const errorData = await response.json();
                setError(`API Error: ${errorData.detail || 'Something went wrong.'}`);
            }
        } catch (e) {
            setError(`Network Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (resultImage) {
        return (
            <div className="w-full min-h-screen bg-gray-900 p-4 text-white text-center flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6">Generation Complete!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    <div><h2 className="text-2xl font-semibold mb-3">Before</h2><img src={selectedImage} alt="Original" className="rounded-lg shadow-lg" /></div>
                    <div><h2 className="text-2xl font-semibold mb-3">AI Reimagined Version</h2><img src={resultImage} alt="Generated" className="rounded-lg shadow-lg" /></div>
                </div>
                <button onClick={() => { setResultImage(null); setIsLoading(false); }} className="mt-8 bg-blue-600 font-bold py-3 px-8 rounded-lg">Try Another Photo</button>
            </div>
        );
    }
    
    return (
        <div className="w-full min-h-screen bg-gray-800 p-4 flex flex-col items-center justify-center">
            <div className="text-center text-white mb-6 max-w-lg">
                <h1 className="text-3xl font-bold">Step 3: Reimagine Your Photo</h1>
                <p className="mt-2">The AI will create a new version of your photo.</p>
            </div>
            <img src={selectedImage} alt="Selected" className="max-w-md rounded-lg shadow-xl mb-8" />
            <button onClick={handleGenerate} disabled={isLoading} className="bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                {isLoading ? 'Generating...' : 'Reimagine with AI'}
            </button>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
    );
};

// ===============================================
// --- Main Page Component ---
// ===============================================
const ArPreviewPage = () => {
    const [step, setStep] = useState('start');
    const [scannedImages, setScannedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleScanComplete = useCallback((images) => { setTimeout(() => { if (images && images.length > 0) { setScannedImages(images); setStep('select_photo'); } else { setStep('start'); } }, 0); }, []);
    const handlePhotoSelection = (imageSrc) => { setSelectedImage(imageSrc); setStep('final_step'); };

    switch (step) {
        case 'scanning': return <CameraCapture onComplete={handleScanComplete} />;
        case 'select_photo': return (
            <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8"><FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" /><h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Scan Complete!</h1><p className="text-lg text-gray-600 mt-2">Now, select the best photo to reimagine.</p></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {scannedImages.map((imgSrc, index) => (
                            <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} onClick={() => handlePhotoSelection(imgSrc)} className="cursor-pointer rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <img src={imgSrc} alt={`Scanned view ${index + 1}`} className="w-full h-full object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
        case 'final_step': return <FinalStepComponent selectedImage={selectedImage} />;
        case 'start':
        default:
            return (
                <div className="relative w-full h-screen bg-gray-800 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2d045efd7?ixlib.rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG9otby1wYWdlfHx8fGVufDB8fHx8&auto.format&fit-crop&w=1974&q=80')" }} />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                        <FaCube className="text-blue-400 text-7xl mb-6" /><h1 className="text-5xl md:text-7xl font-extrabold mb-4">Redesign Your Room</h1><p className="text-xl text-gray-300 max-w-2xl mb-10">Follow a few simple steps to scan your room and replace furniture using AI.</p>
                        <button onClick={() => setStep('scanning')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                            Step 1: Scan Your Room
                        </button>
                    </div>
                </div>
            );
    }
};

export default ArPreviewPage;