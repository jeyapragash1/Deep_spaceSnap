// src/pages/ArPreviewPage.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaCube, FaCamera, FaCheckCircle, FaMagic, FaSpinner, FaUndo, FaEraser, FaPencilAlt, FaSave, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import jsPDF from 'jspdf';

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

// --- THIS IS THE FINAL COMPONENT WITH THE REFINEMENT FIX ---
const InpaintingComponent = ({ selectedImage }) => {
    const sketchCanvasRef = useRef(null);
    const [prompt, setPrompt] = useState('');
    const [strength, setStrength] = useState(75);
    const [isLoading, setIsLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState('');
    
    const [view, setView] = useState('editing');
    const [finalPrompt, setFinalPrompt] = useState('');
    const [savedMask, setSavedMask] = useState(null);
    const [refinementAnswers, setRefinementAnswers] = useState({ item: '', color: '', style: '', lighting: '', materials: '', mood: '' });

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(','); const mimeMatch = arr[0].match(/:(.*?);/); if (!mimeMatch) return null;
        const mime = mimeMatch[1]; const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
        while (n--) { u8arr[n] = bstr.charCodeAt(n); } return new File([u8arr], filename, { type: mime });
    };

    const handleGenerate = async (currentPrompt, imageToEdit, maskToUse) => {
        setIsLoading(true); setError('');
        const apiKey = import.meta.env.VITE_SEGMIND_API_KEY;
        if (!apiKey) { setError("Segmind API key is not configured."); setIsLoading(false); return; }

        try {
            let base64Mask;
            if (maskToUse) {
                base64Mask = maskToUse.split(',')[1];
            } else {
                const maskDataURL = await sketchCanvasRef.current.exportImage('png');
                setSavedMask(maskDataURL);
                base64Mask = maskDataURL.split(',')[1];
            }

            const base64Image = imageToEdit.split(',')[1];
            const response = await fetch('https://api.segmind.com/v1/sd1.5-inpainting', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify({
                    "image": base64Image, "mask": base64Mask, "prompt": currentPrompt, "strength": strength / 100,
                    "negative_prompt": "ugly, tiling, poorly drawn, disfigured, deformed, blurry, bad anatomy",
                    "scheduler": "DDIM", "num_inference_steps": 30, "guidance_scale": 7.5,
                    "seed": Math.floor(Math.random() * 1000000000)
                }),
            });
            if (response.ok) {
                const imageBlob = await response.blob();
                setResultImage(URL.createObjectURL(imageBlob));
                setFinalPrompt(currentPrompt);
                setView('result');
            } else {
                const errorData = await response.json();
                setError(`API Error: ${errorData.detail || 'Something went wrong.'}`);
            }
        } catch (e) { setError(`Network Error: ${e.message}`); } finally { setIsLoading(false); }
    };

    const handleRefinedGenerate = () => {
        let newPrompt = `${prompt}, featuring a ${refinementAnswers.color} ${refinementAnswers.item} in a ${refinementAnswers.style} style.`;
        if(refinementAnswers.lighting) newPrompt += ` The room should have ${refinementAnswers.lighting} lighting`;
        if(refinementAnswers.materials) newPrompt += ` and use materials like ${refinementAnswers.materials}.`;
        if(refinementAnswers.mood) newPrompt += ` The overall mood should be ${refinementAnswers.mood}.`;
        handleGenerate(newPrompt, selectedImage, savedMask);
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = `spacesnap-result-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleSave = () => {
        if (!resultImage || !selectedImage) return;
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(22);
        doc.text("SpaceSnap AI Design Report", 105, 25, { align: 'center' });
        doc.setFontSize(16);
        doc.text("Before", 20, 40);
        doc.addImage(selectedImage, 'JPEG', 20, 45, 80, 0);
        doc.text("AI Edited Version", 115, 40);
        doc.addImage(resultImage, 'JPEG', 115, 45, 80, 0);
        doc.setFontSize(14);
        doc.text("Prompt Used:", 20, 150);
        doc.setFontSize(11);
        const splitPrompt = doc.splitTextToSize(finalPrompt, 170); 
        doc.text(splitPrompt, 20, 160);
        doc.setFontSize(9);
        doc.setTextColor(150);
        const date = new Date().toLocaleDateString();
        doc.text(`Generated by SpaceSnap on ${date}`, 105, 285, { align: 'center' });
        doc.save(`spacesnap-design-${Date.now()}.pdf`);
    };

    if (view === 'result') {
        return (
            <div className="w-full min-h-screen bg-gray-900 p-4 text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6">Generation Complete!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    <div><h2 className="text-2xl font-semibold mb-3">Before</h2><img src={selectedImage} alt="Original" className="rounded-lg shadow-lg" /></div>
                    <div><h2 className="text-2xl font-semibold mb-3">AI Edited Version</h2><img src={resultImage} alt="Generated" className="rounded-lg shadow-lg" /></div>
                </div>
                <div className="mt-6 p-4 bg-gray-800 rounded-lg text-left max-w-5xl w-full">
                    <h3 className="font-bold text-lg">Image Details:</h3>
                    <p className="text-sm text-gray-300 mt-1"><strong>Prompt Used:</strong> "{finalPrompt}"</p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button onClick={() => setView('editing')} className="bg-blue-600 font-bold py-3 px-6 rounded-lg">Start Over</button>
                    <button onClick={() => setView('refining')} className="bg-purple-600 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"><FaPencilAlt /> Refine This Design</button>
                    <button onClick={handleSave} className="bg-teal-500 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"><FaSave /> Save to PDF</button>
                    <button onClick={handleDownload} className="bg-orange-500 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"><FaDownload /> Download Image</button>
                </div>
            </div>
        );
    }
    
    if (view === 'refining') {
        return (
            <div className="w-full min-h-screen bg-gray-700 p-4 flex flex-col items-center justify-center">
                <div className="text-center text-white mb-6 max-w-lg"><h1 className="text-3xl font-bold">Refine Your Design</h1><p className="mt-2">Answer a few questions to improve the result.</p></div>
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 text-black">
                    <div><label className="font-semibold">Item to add/change?</label><select value={refinementAnswers.item} onChange={(e) => setRefinementAnswers({...refinementAnswers, item: e.target.value})} className="w-full p-2 mt-1 border rounded"><option value="">Select...</option><option value="sofa">Sofa</option><option value="armchair">Armchair</option><option value="coffee table">Coffee Table</option><option value="large plant">Large Plant</option><option value="bookshelf">Bookshelf</option></select></div>
                    <div><label className="font-semibold">Predominant Color?</label><input type="text" value={refinementAnswers.color} onChange={(e) => setRefinementAnswers({...refinementAnswers, color: e.target.value})} placeholder="e.g., royal blue" className="w-full p-2 mt-1 border rounded" /></div>
                    <div><label className="font-semibold">Style?</label><select value={refinementAnswers.style} onChange={(e) => setRefinementAnswers({...refinementAnswers, style: e.target.value})} className="w-full p-2 mt-1 border rounded"><option value="">Select...</option><option value="modern">Modern</option><option value="minimalist">Minimalist</option><option value="rustic">Rustic</option><option value="bohemian">Bohemian</option></select></div>
                    <div><label className="font-semibold">Lighting Preference?</label><select value={refinementAnswers.lighting} onChange={(e) => setRefinementAnswers({...refinementAnswers, lighting: e.target.value})} className="w-full p-2 mt-1 border rounded"><option value="">Select...</option><option value="bright and airy">Bright and Airy</option><option value="warm and cozy">Warm and Cozy</option><option value="dramatic and moody">Dramatic and Moody</option></select></div>
                    <div><label className="font-semibold">Key Materials?</label><select value={refinementAnswers.materials} onChange={(e) => setRefinementAnswers({...refinementAnswers, materials: e.target.value})} className="w-full p-2 mt-1 border rounded"><option value="">Select...</option><option value="natural wood">Natural Wood</option><option value="polished metal">Polished Metal</option><option value="soft fabrics">Soft Fabrics</option></select></div>
                    <div><label className="font-semibold">Overall Mood?</label><select value={refinementAnswers.mood} onChange={(e) => setRefinementAnswers({...refinementAnswers, mood: e.target.value})} className="w-full p-2 mt-1 border rounded"><option value="">Select...</option><option value="relaxing and calm">Relaxing and Calm</option><option value="energetic and vibrant">Energetic and Vibrant</option><option value="elegant and sophisticated">Elegant and Sophisticated</option></select></div>
                    <button onClick={handleRefinedGenerate} disabled={isLoading || !refinementAnswers.item || !refinementAnswers.color} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:bg-gray-400">
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                        {isLoading ? 'Generating...' : 'Generate Refined Image'}
                    </button>
                </div>
                <button onClick={() => setView('result')} className="text-white mt-6 underline">Back to Result</button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-800 p-4 flex flex-col items-center justify-center">
            <div className="text-center text-white mb-6 max-w-lg"><h1 className="text-3xl font-bold">Step 3: Edit Your Photo with AI</h1><p className="mt-2">Erase the area to replace, describe the new object, and choose the AI strength.</p></div>
            <div className="relative w-full max-w-lg shadow-2xl rounded-lg overflow-hidden"><ReactSketchCanvas ref={sketchCanvasRef} style={{ border: "none" }} width="100%" height="50vh" backgroundImage={selectedImage} preserveBackgroundImageAspectRatio="xMidYMid meet" eraserWidth={40} /></div>
            <div className="w-full max-w-lg mt-6 flex flex-col gap-4">
                <div className="flex gap-4"><button onClick={() => sketchCanvasRef.current.eraseMode(true)} className="flex-1 bg-pink-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><FaEraser /> Use Eraser</button><button onClick={() => sketchCanvasRef.current.undo()} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><FaUndo /> Undo</button><button onClick={() => sketchCanvasRef.current.clearCanvas()} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">Clear</button></div>
                <div className="bg-white p-3 rounded-lg text-black"><label className="font-semibold">AI Strength: {strength}%</label><input type="range" min="10" max="100" value={strength} onChange={(e) => setStrength(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., a modern blue velvet sofa" className="w-full p-4 rounded-lg text-lg text-black" />
                <button onClick={() => handleGenerate(prompt, selectedImage, null)} disabled={!prompt || isLoading} className="bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 disabled:bg-gray-400">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                    {isLoading ? 'Generating...' : 'Generate New Image'}
                </button>
                {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
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
                    <div className="text-center mb-8"><FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" /><h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Scan Complete!</h1><p className="text-lg text-gray-600 mt-2">Now, select the best photo to edit.</p></div>
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
        case 'final_step': return <InpaintingComponent selectedImage={selectedImage} />;
        case 'start':
        default:
            return (
                <div className="relative w-full h-screen bg-gray-800 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2d045efd7?ixlib.rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG9otby1wYWdlfHx8fGVufDB8fHx8&auto.format&fit=cropw=1974&q=80')" }} />
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