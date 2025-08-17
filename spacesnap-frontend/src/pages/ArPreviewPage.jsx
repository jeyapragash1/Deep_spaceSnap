// src/pages/ArPreviewPage.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react'; // <-- THIS LINE IS NOW CORRECT
import { FaCube, FaCamera, FaCheckCircle, FaMagic, FaSpinner, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '@google/model-viewer';

const ModelViewer = (props) => React.createElement('model-viewer', props);

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

// --- FinalStepComponent (AI Generation) ---
const FinalStepComponent = ({ selectedImage, onStartAR }) => {
    const [isLoading, setIsLoading] = useState(false); const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState(''); const [prompt, setPrompt] = useState('');
    const handleGenerate = async () => {
        if (!prompt) { alert("Please enter a prompt."); return; }
        setIsLoading(true); setError(''); setResultImage(null);
        const apiKey = import.meta.env.VITE_SEGMIND_API_KEY;
        if (!apiKey) { setError("Segmind API key is not configured."); setIsLoading(false); return; }
        try {
            const base64Image = selectedImage.split(',')[1];
            const response = await fetch('https://api.segmind.com/v1/sd1.5-img2img', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify({ image: base64Image, prompt: prompt, negative_prompt: "ugly, tiling, poorly drawn, disfigured, blurry", scheduler: "DDIM", num_inference_steps: 25, guidance_scale: 7.5, strength: 0.85, seed: Math.floor(Math.random() * 1000000000) }),
            });
            if (response.ok) { const imageBlob = await response.blob(); setResultImage(URL.createObjectURL(imageBlob)); } else { const errorData = await response.json(); setError(`API Error: ${errorData.detail || 'Something went wrong.'}`); }
        } catch (e) { setError(`Network Error: ${e.message}`); } finally { setIsLoading(false); }
    };
    const handleDownload = () => { if (!resultImage) return; const link = document.createElement('a'); link.href = resultImage; link.download = `spacesnap-result-${Date.now()}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
    if (resultImage) {
        return (
            <div className="w-full min-h-screen bg-gray-900 p-4 text-white text-center flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6">Generation Complete!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    <div><h2 className="text-2xl font-semibold mb-3">Before</h2><img src={selectedImage} alt="Original" className="rounded-lg shadow-lg" /></div>
                    <div><h2 className="text-2xl font-semibold mb-3">AI Reimagined Version</h2><img src={resultImage} alt="Generated" className="rounded-lg shadow-lg" /></div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={() => { setResultImage(null); setIsLoading(false); }} className="bg-gray-600 font-bold py-3 px-8 rounded-lg">Try Again</button>
                    <button onClick={handleDownload} className="bg-purple-600 font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2"><FaDownload /> Download</button>
                    <button onClick={onStartAR} className="bg-green-600 font-bold py-3 px-8 rounded-lg">Next: Add Furniture in AR</button>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full min-h-screen bg-gray-800 p-4 flex flex-col items-center justify-center">
            <div className="text-center text-white mb-6 max-w-lg"><h1 className="text-3xl font-bold">Step 3: Reimagine Your Photo</h1><p className="mt-2">Describe the new style you want to see in the photo.</p></div>
            <img src={selectedImage} alt="Selected" className="max-w-md rounded-lg shadow-xl mb-8" />
            <div className="w-full max-w-md flex flex-col gap-4">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., a modern room with a red sofa" className="w-full p-4 rounded-lg text-lg text-black" />
                <button onClick={handleGenerate} disabled={isLoading || !prompt} className="bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 disabled:bg-gray-400">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                    {isLoading ? 'Generating...' : 'Reimagine with AI'}
                </button>
            </div>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
    );
};

// --- Component for Step 4: Placing 3D furniture models in AR ---
const FinalARView = ({ onGoBack }) => {
    const furnitureLibrary = [
        { name: 'Green Sofa', modelUrl: 'https://res.cloudinary.com/dsl2v33np/image/upload/v1755158028/green_armchair_kvvzc8.glb', thumbnail: 'https://res.cloudinary.com/dsl2v33np/image/upload/w_256,h_256,c_pad/v1755158028/green_armchair_kvvzc8.jpg' },
        { name: 'Classic Armchair', modelUrl: 'https://res.cloudinary.com/dsl2v33np/image/upload/v1755158004/armchair_s25cxk.glb', thumbnail: 'https://res.cloudinary.com/dsl2v33np/image/upload/w_256,h_256,c_pad/v1755158004/armchair_s25cxk.jpg' },
        { name: 'Sleek Office Chair', modelUrl: 'https://res.cloudinary.com/dsl2v33np/image/upload/v1755158006/office_chair1_ufqtsf.glb', thumbnail: 'https://res.cloudinary.com/dsl2v33np/image/upload/w_256,h_256,c_pad/v1755158006/office_chair1_ufqtsf.jpg' },
    ];
    const [selectedModel, setSelectedModel] = useState(furnitureLibrary[0]);

    return (
        <div className="w-full h-screen flex flex-col bg-gray-200">
            <header className="w-full bg-white p-4 shadow-md flex items-center justify-between z-10">
                <button onClick={onGoBack} className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-black"><FaArrowLeft /> Back to Results</button>
                <h1 className="text-xl font-bold">Step 4: Place Furniture in AR</h1>
            </header>
            <div className="flex-grow flex flex-col md:flex-row-reverse relative">
                <div className="w-full md:w-1/3 p-4 bg-white overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Select an Item</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {furnitureLibrary.map(item => (
                            <button key={item.name} onClick={() => setSelectedModel(item)} className={`p-3 rounded-lg border-2 transition-all ${selectedModel.name === item.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}>
                                <img src={item.thumbnail} alt={item.name} className="w-full h-24 object-contain" />
                                <p className="font-semibold text-center mt-2 text-sm">{item.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-2/3 h-96 md:h-full bg-gray-800">
                    <ModelViewer
                        src={selectedModel.modelUrl} alt={`A 3D model of ${selectedModel.name}`}
                        ar ar-modes="webxr scene-viewer quick-look" camera-controls auto-rotate
                        style={{ width: '100%', height: '100%' }}
                    >
                        <button slot="ar-button" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg absolute bottom-4 left-1/2 -translate-x-1/2">
                            View in Your Space
                        </button>
                    </ModelViewer>
                </div>
            </div>
        </div>
    );
};


// ===============================================
// --- The Main Page Component that controls the flow ---
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
        case 'final_step': return <FinalStepComponent selectedImage={selectedImage} onStartAR={() => setStep('ar_placement')} />;
        case 'ar_placement': return <FinalARView onGoBack={() => setStep('final_step')} />;
        case 'start':
        default:
            return (
                <div className="relative w-full h-screen bg-gray-800 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2d045efd7?ixlib.rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG9otby1wYWdlfHx8fGVufDB8fHx8&auto.format&fit=crop&w=1974&q=80')" }} />
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