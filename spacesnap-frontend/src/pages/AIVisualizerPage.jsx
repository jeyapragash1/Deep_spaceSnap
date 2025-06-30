// src/pages/AiVisualizerPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import aiVisualizerService from '../services/aiVisualizerService';
import { wallColorPalettes, ceilingColorPalettes, floorPatterns, placeableObjects } from '../data/designData';
import DraggableItem from '../components/ui/DraggableItem';

// --- FINAL, GUARANTEED CORRECT ICON IMPORTS ---
// We will use only icons from the main 'fa' (Font Awesome) library to ensure this works.
import { FaPalette, FaCouch, FaSpinner, FaMagic, FaBorderAll, FaUpload, FaLightbulb } from 'react-icons/fa';

const AiVisualizerPage = () => {
    const location = useLocation();

    // --- STATE MANAGEMENT ---
    const [originalImage, setOriginalImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVisualized, setIsVisualized] = useState(false);
    
    // Design choices state
    const [selectedWallColor, setSelectedWallColor] = useState('#FFFFFF');
    const [selectedCeilingColor, setSelectedCeilingColor] = useState('#FFFFFF');
    const [selectedFloorPattern, setSelectedFloorPattern] = useState(floorPatterns[0]);
    const [placedObjects, setPlacedObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    
    // AI results state
    const [masks, setMasks] = useState({});
    
    // UI state
    const [activeTab, setActiveTab] = useState('walls');

    useEffect(() => {
        const quizStyle = location.state?.suggestedStyle;
        if (quizStyle && wallColorPalettes[quizStyle]) {
            setSelectedWallColor(wallColorPalettes[quizStyle][0]);
        }
    }, [location.state]);

    // --- HANDLER FUNCTIONS ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalImage(file);
            setImagePreview(URL.createObjectURL(file));
            setIsVisualized(false); 
            setMasks({}); 
            setPlacedObjects([]);
        }
    };

    const handleVisualizeClick = async () => {
        if (!originalImage) return;
        setIsProcessing(true); 
        setIsVisualized(false);
        try {
            const result = await aiVisualizerService.segmentRoom(originalImage);
            setMasks(result);
            setIsVisualized(true);
        } catch (error) { 
            console.error(error); 
            alert("An error occurred during visualization.");
        } finally { 
            setIsProcessing(false); 
        }
    };

    const addObjectToScene = (obj) => {
        const newObject = { ...obj, id: `${obj.id}_${Date.now()}`, position: { x: 50, y: 150 } };
        setPlacedObjects([...placedObjects, newObject]);
    };
    
    const updateObjectPosition = (id, position) => {
        setPlacedObjects(placedObjects.map(obj => obj.id === id ? { ...obj, position } : obj));
    };

    const deleteSelectedObject = () => {
        if (selectedObjectId) {
            setPlacedObjects(placedObjects.filter(obj => obj.id !== selectedObjectId));
            setSelectedObjectId(null);
        }
    };

    // --- RENDER LOGIC ---
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-teal mb-4">AI Room Visualizer</h1>
                    <p className="text-lg text-gray-700">Design your walls, floors, ceiling, and add furniture!</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- Left Side: Control Panel --- */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-neutral-dark mb-2">1. Upload Your Room</h2>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-teal file:text-white hover:file:bg-opacity-90 cursor-pointer"/>
                        </div>
                        <button onClick={handleVisualizeClick} disabled={isProcessing || !originalImage} className="w-full bg-accent-gold text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-3 disabled:bg-gray-400 mb-6">
                            {isProcessing ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                            {isProcessing ? 'Analyzing...' : '2. Visualize!'}
                        </button>
                        
                        <h2 className="text-xl font-bold text-neutral-dark mb-2">3. Customize Your Design</h2>
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-4 overflow-x-auto">
                                <button onClick={() => setActiveTab('walls')} className={`flex-shrink-0 p-2 font-medium ${activeTab === 'walls' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaPalette className="inline mr-1" />Walls</button>
                                <button onClick={() => setActiveTab('floor')} className={`flex-shrink-0 p-2 font-medium ${activeTab === 'floor' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaBorderAll className="inline mr-1" />Floor</button>
                                {/* THIS LINE IS NOW 100% CORRECT with a guaranteed icon from the 'fa' library */}
                                <button onClick={() => setActiveTab('ceiling')} className={`flex-shrink-0 p-2 font-medium ${activeTab === 'ceiling' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaLightbulb className="inline mr-1" />Ceiling</button>
                                <button onClick={() => setActiveTab('objects')} className={`flex-shrink-0 p-2 font-medium ${activeTab === 'objects' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaCouch className="inline mr-1" />Objects</button>
                            </nav>
                        </div>
                        
                        <div className="pt-4 h-64 overflow-y-auto">
                            {activeTab === 'walls' && <div className="flex flex-wrap gap-2">{Object.values(wallColorPalettes.default).map(c=><button key={c} onClick={()=>setSelectedWallColor(c)} style={{backgroundColor:c}} className={`w-8 h-8 m-1 rounded-full border-2 ${selectedWallColor===c?'border-primary-teal':''}`}></button>)}</div>}
                            {activeTab === 'floor' && <div className="flex flex-wrap gap-2">{floorPatterns.map(p=><button key={p.id} onClick={()=>setSelectedFloorPattern(p)} className={`w-12 h-12 m-1 border-2 ${selectedFloorPattern.id===p.id?'border-primary-teal':''}`}><img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-sm"/></button>)}</div>}
                            {activeTab === 'ceiling' && <div className="flex flex-wrap gap-2">{ceilingColorPalettes.default.map(c=><button key={c} onClick={()=>setSelectedCeilingColor(c)} style={{backgroundColor:c}} className={`w-8 h-8 m-1 rounded-full border-2 ${selectedCeilingColor===c?'border-primary-teal':''}`}></button>)}</div>}
                            {activeTab === 'objects' && <div className="space-y-2">{Object.entries(placeableObjects).map(([category, items])=>(<div key={category}><h4 className="font-semibold capitalize">{category}</h4><div className="flex flex-wrap gap-2">{items.map(i=><button key={i.id} onClick={()=>addObjectToScene(i)} className="p-1 border rounded hover:border-primary-teal"><img src={i.image} alt={i.name} className="w-12 h-12 object-contain"/></button>)}</div></div>))}</div>}
                        </div>

                        {activeTab === 'objects' && selectedObjectId && (
                             <button onClick={deleteSelectedObject} className="w-full mt-4 bg-red-600 text-white font-bold py-2 rounded-lg">Delete Selected Object</button>
                        )}
                    </div>

                    {/* --- Right Side: Image Display --- */}
                    <div className="lg:col-span-8 bg-gray-200 p-2 rounded-lg shadow-lg flex items-center justify-center min-h-[500px] relative overflow-hidden">
                        {!imagePreview && <div className="text-center text-gray-500"><FaUpload size={40} className="mx-auto mb-2"/><p>Upload an image to get started</p></div>}
                        {imagePreview && (
                            <div className="relative w-full h-full select-none" onClick={(e) => { e.stopPropagation(); setSelectedObjectId(null); }}>
                                <img src={imagePreview} alt="Your Room" className="absolute top-0 left-0 w-full h-full object-contain z-0" />
                                {isVisualized && (
                                    <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="none">
                                        <defs><pattern id="floorPattern" patternUnits="userSpaceOnUse" width="100" height="100"><image href={selectedFloorPattern.image} width="100" height="100"/></pattern></defs>
                                        <path d={masks.floorMask} fill="url(#floorPattern)" className="animate-fadeIn" />
                                        <path d={masks.wallMask} fill={selectedWallColor} style={{ mixBlendMode: 'multiply' }} className="animate-fadeIn" />
                                        <path d={masks.ceilingMask} fill={selectedCeilingColor} style={{ mixBlendMode: 'color-burn' }} className="animate-fadeIn" />
                                    </svg>
                                )}
                                <div className="absolute top-0 left-0 w-full h-full z-20">
                                    {placedObjects.map(obj => <DraggableItem key={obj.id} object={obj} onUpdate={updateObjectPosition} onSelect={setSelectedObjectId} isSelected={selectedObjectId === obj.id} />)}
                                </div>
                            </div>
                        )}
                        {isProcessing && <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white z-30"><FaSpinner className="animate-spin text-5xl mb-4" /><p className="font-semibold">Redesigning your space...</p></div>}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AiVisualizerPage;