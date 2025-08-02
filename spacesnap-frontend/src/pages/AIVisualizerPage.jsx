// src/pages/AIVisualizerPage.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
// --- MODIFIED: Use new hooks for routing logic ---
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { wallColorPalettes, ceilingColorPalettes, floorPatterns, placeableObjects } from "../data/designData";
import DraggableItem from "../components/ui/DraggableItem";
import Button from "../components/common/Button";
import aiVisualizerService from "../services/aiVisualizerService";
import {
  FaPalette, FaCouch, FaSpinner, FaMagic, FaBorderAll, FaUpload, FaSave, FaArrowRight, FaTrash, FaUndo, FaLightbulb, FaDownload,
} from "react-icons/fa";
// --- NEW: Import for loading spinner ---
import LoadingSpinner from "../components/common/LoadingSpinner";


const OptionButton = ({ image, name, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-2 border border-gray-300 rounded-md flex flex-col items-center hover:scale-105 hover:border-teal-400 hover:shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-t from-white to-gray-50 hover:from-teal-50"
  >
    <img src={image} alt={name} className="w-16 h-16 object-contain" />
    <span className="text-xs mt-1 text-gray-700 truncate w-full">{name}</span>
  </button>
);

const AiVisualizerPage = () => {
    // --- MODIFIED: Routing hooks ---
    const { designId } = useParams();
    const navigate = useNavigate();

    // --- MODIFIED: New state variables added ---
    const [isLoadingDesign, setIsLoadingDesign] = useState(true);
    const [designName, setDesignName] = useState(`My Design - ${new Date().toLocaleDateString()}`);

    // --- (Your existing state variables) ---
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVisualized, setIsVisualized] = useState(false);
    const [selectedWallColor, setSelectedWallColor] = useState("#FFFFFF");
    const [selectedCeilingColor, setSelectedCeilingColor] = useState("#FFFFFF");
    const [selectedFloorPattern, setSelectedFloorPattern] = useState(floorPatterns[0]);
    const [placedObjects, setPlacedObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [masks, setMasks] = useState({});
    const [activeTab, setActiveTab] = useState("walls");
    const [isSaving, setIsSaving] = useState(false);
    const canvasRef = useRef(null);

    // --- NEW: useEffect to load a design if `designId` exists in the URL ---
    useEffect(() => {
        if (designId) {
            const fetchDesignForEdit = async () => {
                setIsLoadingDesign(true);
                try {
                    const res = await axios.get(`http://localhost:5000/api/designs/${designId}`);
                    const { name, designData, originalImage } = res.data;
                    const parsedData = JSON.parse(designData);

                    setDesignName(name);
                    setImagePreview(originalImage);
                    setSelectedWallColor(parsedData.wallColor || "#FFFFFF");
                    setSelectedCeilingColor(parsedData.ceilingColor || "#FFFFFF");
                    setSelectedFloorPattern(floorPatterns.find(p => p.id === parsedData.floorPatternId) || floorPatterns[0]);
                    setPlacedObjects(parsedData.objects || []);
                    setIsVisualized(true);
                } catch (error) {
                    alert("Could not load this design. It may have been deleted.");
                    navigate('/user/designs');
                } finally {
                    setIsLoadingDesign(false);
                }
            };
            fetchDesignForEdit();
        } else {
            setIsLoadingDesign(false);
        }
    }, [designId, navigate]);

// In src/pages/AIVisualizerPage.jsx

// --- UPGRADED: handleSaveDesign now handles both creating and updating ---
const handleSaveDesign = async () => {
    if (!isVisualized) return alert("Please visualize a design before saving.");
    if (!designName.trim()) return alert("Please give your design a name.");
    setIsSaving(true);
    try {
        const canvas = await html2canvas(canvasRef.current, { useCORS: true });
        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        const designDataToSave = {
            wallColor: selectedWallColor,
            ceilingColor: selectedCeilingColor,
            floorPatternId: selectedFloorPattern.id,
            objects: placedObjects,
        };

        const payload = {
            name: designName,
            designData: JSON.stringify(designDataToSave),
            thumbnail: thumbnailDataUrl,
            originalImage: imagePreview,
        };

        if (designId) {
            // --- USE "api" HERE ---
            await api.put(`/designs/${designId}`, payload);
        } else {
            // --- AND "api" HERE ---
            await api.post("/designs", payload);
        }
        
        alert("Design Saved Successfully!");
        navigate('/user/designs');
    } catch (err) {
        console.error(err);
        // This is the line that shows the alert
        alert("Failed to save design. Please ensure you are logged in and try again.");
    } finally {
        setIsSaving(false);
    }
};
    
  // --- (Your original functions, with one fix) ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImagePreview(URL.createObjectURL(file));
          setIsVisualized(false);
        }
    };
    const handleVisualizeClick = async () => {
        if (!imagePreview) return;
        setIsProcessing(true);
        try {
          const result = await aiVisualizerService.segmentRoom(null);
          setMasks(result); setIsVisualized(true);
        } catch (error) { alert("AI analysis failed."); } 
        finally { setIsProcessing(false); }
    };

    // --- THIS IS THE FIX for the "duplicate key" warning ---
    const addObjectToScene = (obj) => {
        const newObject = { 
            ...obj, 
            id: `${obj.id}_${crypto.randomUUID()}`, // Guarantees a unique ID every time
            position: { x: 100, y: 100 } 
        };
        setPlacedObjects((prev) => [...prev, newObject]);
    };

    const updateObjectPosition = useCallback((id, newPosition) => {
        setPlacedObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, position: newPosition } : obj)));
    }, []);
    const deleteObject = (id) => setPlacedObjects((prev) => prev.filter((obj) => obj.id !== id));
    const handleReset = () => {
        setSelectedWallColor("#FFFFFF");
        setSelectedCeilingColor("#FFFFFF");
        setSelectedFloorPattern(floorPatterns[0]);
        setPlacedObjects([]);
    };
    const handleDownloadImage = () => {
        if (canvasRef.current) {
          setSelectedObjectId(null);
          setTimeout(() => {
            html2canvas(canvasRef.current, { useCORS: true }).then((canvas) => {
              canvas.toBlob((blob) => saveAs(blob, "MySpaceSnap_Design.png"));
            });
          }, 100);
        }
    };

    // --- NEW: Loading state for editing mode ---
    if (isLoadingDesign) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    // --- (Your original JSX is fully preserved below) ---
    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-r from-gray-100 via-white to-gray-100 animate-gradient-x">
            <aside className="w-80 bg-white shadow-2xl flex flex-col transition-all duration-300 border-r border-gray-200 hover:shadow-inner">
                <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Customize Your Room</h2>
                </div>
                <div className="flex border-b">
                <button
                    onClick={() => setActiveTab("walls")}
                    className={`flex-1 p-3 text-sm font-semibold ${
                    activeTab === "walls" ? "text-primary-teal border-b-2 border-primary-teal" : "text-gray-500"
                    }`}
                >
                    <FaPalette className="mx-auto" />
                </button>
                <button
                    onClick={() => setActiveTab("floor")}
                    className={`flex-1 p-3 text-sm font-semibold ${
                    activeTab === "floor" ? "text-primary-teal border-b-2 border-primary-teal" : "text-gray-500"
                    }`}
                >
                    <FaBorderAll className="mx-auto" />
                </button>
                <button
                    onClick={() => setActiveTab("ceiling")}
                    className={`flex-1 p-3 text-sm font-semibold ${
                    activeTab === "ceiling" ? "text-primary-teal border-b-2 border-primary-teal" : "text-gray-500"
                    }`}
                >
                    <FaLightbulb className="mx-auto" />
                </button>
                <button
                    onClick={() => setActiveTab("objects")}
                    className={`flex-1 p-3 text-sm font-semibold ${
                    activeTab === "objects" ? "text-primary-teal border-b-2 border-primary-teal" : "text-gray-500"
                    }`}
                >
                    <FaCouch className="mx-auto" />
                </button>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                {activeTab === "walls" && (
                    <div className="space-y-4">
                    {Object.entries(wallColorPalettes).map(([paletteName, colors]) => (
                        <div key={paletteName}>
                        <h4 className="font-semibold mb-2 capitalize">{paletteName}</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedWallColor(c)}
                                style={{ backgroundColor: c }}
                                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out transform hover:scale-110 ${
                                selectedWallColor === c ? "border-teal-500 ring-2 ring-teal-300 animate-pulse" : "border-gray-300"
                                }`}
                            ></button>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {activeTab === "ceiling" && (
                    <div className="space-y-4">
                    {Object.entries(ceilingColorPalettes).map(([paletteName, colors]) => (
                        <div key={paletteName}>
                        <h4 className="font-semibold mb-2 capitalize">{paletteName}</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedCeilingColor(c)}
                                style={{ backgroundColor: c }}
                                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out transform hover:scale-110 ${
                                selectedCeilingColor === c ? "border-teal-500 ring-2 ring-teal-300 animate-pulse" : "border-gray-300"
                                }`}
                            ></button>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {activeTab === "floor" && (
                    <div className="grid grid-cols-3 gap-2">
                    {floorPatterns.map((p) => (
                        <OptionButton key={p.id} {...p} onClick={() => setSelectedFloorPattern(p)} />
                    ))}
                    </div>
                )}
                {activeTab === "objects" && (
                    <div className="space-y-4">
                    {Object.entries(placeableObjects).map(([category, items]) => (
                        <div key={category}>
                        <h4 className="font-bold capitalize mb-2">{category}</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {items.map((i) => (
                            <OptionButton key={i.id} {...i} onClick={() => addObjectToScene(i)} />
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </aside>
    
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div
                    ref={canvasRef}
                    className="w-full h-full bg-white rounded-lg shadow-xl relative overflow-hidden flex items-center justify-center"
                    onClick={() => setSelectedObjectId(null)}
                >
                    {!imagePreview && (
                        <div className="text-center text-gray-400">
                        <FaUpload size={50} />
                        <p className="mt-2">Upload an image to start designing</p>
                        </div>
                    )}
                    {imagePreview && <img src={imagePreview} alt="Your Room" className="absolute top-0 left-0 w-full h-full object-contain" />}
                    {isVisualized && (
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="none">
                        <defs>
                            <pattern id="floorPattern" patternUnits="userSpaceOnUse" width="100" height="100">
                            <image href={selectedFloorPattern.image} width="100" height="100" />
                            </pattern>
                        </defs>
                        <path d={masks.floorMask} fill="url(#floorPattern)" style={{ mixBlendMode: "multiply" }} />
                        <path d={masks.wallMask} fill={selectedWallColor} style={{ mixBlendMode: "multiply" }} />
                        <path d={masks.ceilingMask} fill={selectedCeilingColor} style={{ mixBlendMode: "multiply" }} />
                        </svg>
                    )}
                    {placedObjects.map((obj) => (
                        <DraggableItem
                        key={obj.id}
                        object={obj}
                        onUpdate={updateObjectPosition}
                        onSelect={setSelectedObjectId}
                        onDelete={deleteObject}
                        isSelected={selectedObjectId === obj.id}
                        containerRef={canvasRef}
                        />
                    ))}
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white">
                        <FaSpinner className="animate-spin text-4xl" />
                        </div>
                    )}
                </div>
            </main>
    
            <aside className="w-80 bg-white shadow-2xl flex flex-col transition-all duration-300 border-l border-gray-200 hover:shadow-inner">
                {/* --- MODIFIED: Added Input for Design Name --- */}
                <div className="p-4 border-b">
                    <label htmlFor="designName" className="font-semibold text-sm mb-1 block">Design Name</label>
                    <input
                        id="designName"
                        type="text"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., Cozy Living Room"
                    />
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label
                        htmlFor="upload-btn"
                        className="w-full text-center bg-primary-teal text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-opacity-90"
                        >
                        <FaUpload /> Upload Room
                        </label>
                        <input id="upload-btn" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    <Button
                        onClick={handleVisualizeClick}
                        disabled={!imagePreview || isProcessing}
                        className="w-full bg-accent-gold text-white hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                    >
                        {isProcessing ? "Analyzing..." : "Visualize Room"}
                    </Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 border-t">
                    <h3 className="font-semibold mb-2">Design Layers</h3>
                    {placedObjects.length === 0 ? (
                        <p className="text-xs text-gray-500">Add objects to see them here.</p>
                    ) : (
                        <ul className="space-y-2">
                        {placedObjects.map((obj) => (
                            <li
                            key={obj.id}
                            onClick={() => setSelectedObjectId(obj.id)}
                            className={`p-2 rounded-md text-sm flex items-center justify-between cursor-pointer ${
                                selectedObjectId === obj.id ? "bg-teal-100" : "hover:bg-gray-50"
                            }`}
                            >
                            <span>{obj.name}</span>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                deleteObject(obj.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash size={12} />
                            </button>
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
                <div className="p-4 border-t space-y-2">
                    <Button
                        onClick={handleReset}
                        disabled={!isVisualized}
                        className="w-full bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300"
                    >
                        <FaUndo /> Reset Design
                    </Button>
                    <Button
                        onClick={handleDownloadImage}
                        disabled={!isVisualized}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                    >
                        <FaDownload /> Download Image
                    </Button>
                    {/* --- MODIFIED: onClick points to the upgraded save function --- */}
                    <Button
                        onClick={handleSaveDesign}
                        disabled={!isVisualized || isSaving}
                        className="w-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                    >
                        {isSaving ? "Saving..." : <><FaSave className="inline mr-2"/>Save Design</>}
                    </Button>
                    <Button
                        onClick={() => navigate("/ar-preview")}
                        disabled={!isVisualized}
                        className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
                    >
                        View in AR <FaArrowRight />
                    </Button>
                </div>
            </aside>
        </div>
    );
};

export default AiVisualizerPage;