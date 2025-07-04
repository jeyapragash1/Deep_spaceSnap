// src/pages/AiVisualizerPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { wallColorPalettes, ceilingColorPalettes, floorPatterns, placeableObjects } from '../data/designData';
import DraggableItem from '../components/ui/DraggableItem';
import Button from '../components/common/Button';
import aiVisualizerService from '../services/aiVisualizerService';

// --- THIS IS THE FIX: We use FaLightbulb from 'fa' which is guaranteed to exist ---
import { FaPalette, FaCouch, FaSpinner, FaMagic, FaBorderAll, FaUpload, FaSave, FaArrowRight, FaTrash, FaLightbulb } from 'react-icons/fa';

const AiVisualizerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [originalImage, setOriginalImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVisualized, setIsVisualized] = useState(false);
    const [selectedWallColor, setSelectedWallColor] = useState('#FFFFFF');
    const [selectedCeilingColor, setSelectedCeilingColor] = useState('#FFFFFF');
    const [selectedFloorPattern, setSelectedFloorPattern] = useState(floorPatterns[0]);
    const [placedObjects, setPlacedObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [masks, setMasks] = useState({});
    const [activeTab, setActiveTab] = useState('walls');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const quizStyle = location.state?.suggestedStyle;
        if (quizStyle && wallColorPalettes[quizStyle]) {
            setSelectedWallColor(wallColorPalettes[quizStyle][0]);
        }
    }, [location.state]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalImage(file);
            setImagePreview(URL.createObjectURL(file));
            setIsVisualized(false); setMasks({}); setPlacedObjects([]);
        }
    };

    const handleVisualizeClick = async () => {
        if (!originalImage) return;
        setIsProcessing(true); setIsVisualized(false);
        try {
            const result = await aiVisualizerService.segmentRoom(originalImage);
            setMasks(result);
            setIsVisualized(true);
        } catch (error) {
            console.error(error); alert("An error occurred during visualization.");
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

    const handleSaveDesign = async () => {
        if (!isVisualized) return alert("Please visualize a design before saving.");
        setIsSaving(true);
        try {
            const designDataToSave = { wallColor: selectedWallColor, ceilingColor: selectedCeilingColor, floorPatternId: selectedFloorPattern.id, objects: placedObjects.map(obj => ({ id: obj.id.split('_')[0], position: obj.position })) };
            const body = { name: `My Room Design - ${new Date().toLocaleDateString()}`, designData: JSON.stringify(designDataToSave), thumbnail: 'https://source.unsplash.com/random/400x300?interior,design' };
            const res = await axios.post('http://localhost:5000/api/designs', body);
            alert(res.data.msg);
        } catch (err) {
            console.error(err);
            alert("Failed to save design. Please make sure you are logged in.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-teal mb-4">AI Room Visualizer</h1>
                <p className="text-lg text-gray-700">Design your walls, floors, ceiling, and add items!</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Control Panel */}
                <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-6"><h2 className="text-xl font-bold mb-2">1. Upload Your Room</h2><input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-primary-teal file:text-white hover:file:bg-opacity-90"/></div>
                    <button onClick={handleVisualizeClick} disabled={isProcessing || !originalImage} className="w-full bg-accent-gold text-white font-bold py-3 rounded-lg text-lg flex items-center justify-center gap-3 disabled:bg-gray-400 mb-6">{isProcessing ? <FaSpinner className="animate-spin" /> : <FaMagic />} {isProcessing ? 'Analyzing...' : '2. Visualize!'}</button>
                    <h2 className="text-xl font-bold mb-2">3. Customize</h2>
                    <div className="border-b"><nav className="flex space-x-4 overflow-x-auto"><button onClick={() => setActiveTab('walls')} className={`p-2 ${activeTab === 'walls' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaPalette/> Walls</button><button onClick={() => setActiveTab('floor')} className={`p-2 ${activeTab === 'floor' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaBorderAll/> Floor</button>
                    {/* --- THIS IS THE FIX: Using the correct FaLightbulb icon --- */}
                    <button onClick={() => setActiveTab('ceiling')} className={`p-2 ${activeTab === 'ceiling' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaLightbulb/> Ceiling</button>
                    <button onClick={() => setActiveTab('objects')} className={`p-2 ${activeTab === 'objects' ? 'text-primary-teal border-b-2 border-primary-teal' : 'text-gray-500'}`}><FaCouch/> Objects</button></nav></div>
                    <div className="pt-4 h-64 overflow-y-auto">{activeTab === 'walls' && <div className="flex flex-wrap gap-2">{Object.values(wallColorPalettes.default).map(c=><button key={c} onClick={()=>setSelectedWallColor(c)} style={{backgroundColor:c}} className={`w-8 h-8 m-1 rounded-full border-2 ${selectedWallColor===c?'border-primary-teal':''}`}></button>)}</div>}{activeTab === 'floor' && <div className="flex flex-wrap gap-2">{floorPatterns.map(p=><button key={p.id} onClick={()=>setSelectedFloorPattern(p)} className={`w-12 h-12 m-1 border-2 ${selectedFloorPattern.id===p.id?'border-primary-teal':''}`}><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></button>)}</div>}{activeTab === 'ceiling' && <div className="flex flex-wrap gap-2">{ceilingColorPalettes.default.map(c=><button key={c} onClick={()=>setSelectedCeilingColor(c)} style={{backgroundColor:c}} className={`w-8 h-8 m-1 rounded-full border-2 ${selectedCeilingColor===c?'border-primary-teal':''}`}></button>)}</div>}{activeTab === 'objects' && <div className="space-y-2">{Object.entries(placeableObjects).map(([category, items])=>(<div key={category}><h4 className="font-semibold capitalize">{category}</h4><div className="flex flex-wrap gap-2">{items.map(i=><button key={i.id} onClick={()=>addObjectToScene(i)} className="p-1 border rounded hover:border-primary-teal"><img src={i.image} alt={i.name} className="w-12 h-12 object-contain"/></button>)}</div></div>))}</div>}</div>
                    {activeTab === 'objects' && selectedObjectId && (<button onClick={deleteSelectedObject} className="w-full mt-4 bg-red-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"><FaTrash /> Delete Selected</button>)}
                </div>
                {/* Right Side: Image Display */}
                <div className="lg:col-span-8">
                    <div className="bg-gray-200 p-2 rounded-lg shadow-lg flex items-center justify-center min-h-[500px] relative overflow-hidden">{!imagePreview && <div className="text-center text-gray-500"><FaUpload size={40} className="mx-auto mb-2"/><p>Upload an image to start</p></div>}{imagePreview && (<div className="relative w-full h-full" onClick={(e) => { e.stopPropagation(); setSelectedObjectId(null); }}><img src={imagePreview} alt="Your Room" className="absolute top-0 left-0 w-full h-full object-contain z-0" />{isVisualized && (<svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="none"><defs><pattern id="floorPattern" patternUnits="userSpaceOnUse" width="100" height="100"><image href={selectedFloorPattern.image} width="100" height="100"/></pattern></defs><path d={masks.floorMask} fill="url(#floorPattern)"/><path d={masks.wallMask} fill={selectedWallColor} style={{ mixBlendMode: 'multiply' }}/><path d={masks.ceilingMask} fill={selectedCeilingColor} style={{ mixBlendMode: 'color-burn' }}/></svg>)}{<div className="absolute top-0 left-0 w-full h-full z-20">{placedObjects.map(obj => <DraggableItem key={obj.id} object={obj} onUpdate={updateObjectPosition} onSelect={setSelectedObjectId} isSelected={selectedObjectId === obj.id} />)}</div>}</div>)}{isProcessing && <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white z-30"><FaSpinner className="animate-spin text-5xl mb-4" /><p>Redesigning your space...</p></div>}</div>
                    {isVisualized && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-neutral-dark mb-4">Finalize Your Design</h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button onClick={handleSaveDesign} disabled={isSaving} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">{isSaving ? <FaSpinner className="animate-spin"/> : <FaSave/>} {isSaving ? 'Saving...' : 'Save Design'}</Button>
                                <Button onClick={() => navigate('/ar-preview')} className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">View in AR <FaArrowRight /></Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiVisualizerPage;