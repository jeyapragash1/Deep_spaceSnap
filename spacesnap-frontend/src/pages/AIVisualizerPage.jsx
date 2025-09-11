// src/pages/AIVisualizerPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

import {
  wallColorPalettes,
  ceilingColorPalettes,
  floorPatterns,
  placeableObjects,
} from "../data/designData";

import DraggableItem from "../components/ui/DraggableItem";
import Button from "../components/common/Button";
import aiVisualizerService from "../services/aiVisualizerService";

import {
  FaPalette,
  FaCouch,
  FaSpinner,
  FaBorderAll,
  FaUpload,
  FaSave,
  FaArrowRight,
  FaTrash,
  FaUndo,
  FaLightbulb,
  FaDownload,
  FaSwatchbook,
  FaBars,
  FaTimes,
  FaMagic,
} from "react-icons/fa";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";


// Small option button card
const OptionButton = ({ image, name, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-2 border border-gray-200 rounded-md flex flex-col items-center hover:scale-105 hover:border-teal-400 hover:shadow transition-all duration-200 bg-white"
  >
    <img src={image} alt={name} className="w-16 h-16 object-contain block" />
    <span className="text-xs mt-1 text-gray-700 truncate w-full">{name}</span>
  </button>
);

const AiVisualizerPage = () => {
  const { designId } = useParams();
  const navigate = useNavigate();

  const [isLoadingDesign, setIsLoadingDesign] = useState(true);
  const [designName, setDesignName] = useState(
    `My Design - ${new Date().toLocaleDateString()}`
  );

  const [imagePreview, setImagePreview] = useState(null);
  const [outPutImage, setOutPutImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);

  const [selectedWallColor, setSelectedWallColor] = useState("#FFFFFF");
  const [selectedCeilingColor, setSelectedCeilingColor] = useState("#FFFFFF");
  const [selectedFloorPattern, setSelectedFloorPattern] = useState(
    floorPatterns[0]
  );

  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  const [masks, setMasks] = useState({});
  const [activeTab, setActiveTab] = useState("walls");
  const [isSaving, setIsSaving] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [roomStyle, setRoomStyle] = useState("");
  const [aiStyle, setAiStyle] = useState("");
  const [canGenerate, setCanGenerate] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState("");
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);

  // prefer generated image when available
  const baseImage = outPutImage || imagePreview;

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [showTools, setShowTools] = useState(false);



  // load existing design (if editing)
  useEffect(() => {
    const run = async () => {
      if (!designId) {
        setIsLoadingDesign(false);
        return;
      }
      setIsLoadingDesign(true);
      try {
        const res = await api.get(`/designs/${designId}`);
        const { name, designData, originalImage } = res.data;
        const parsedData = JSON.parse(designData || "{}");

        setDesignName(name || designName);
        setImagePreview(originalImage || null);
        setSelectedWallColor(parsedData.wallColor || "#FFFFFF");
        setSelectedCeilingColor(parsedData.ceilingColor || "#FFFFFF");
        setSelectedFloorPattern(
          floorPatterns.find((p) => p.id === parsedData.floorPatternId) ||
            floorPatterns[0]
        );
        setPlacedObjects(parsedData.objects || []);
        setIsVisualized(Boolean(originalImage));
        setCanGenerate(Boolean(originalImage) && prompt.trim().length > 0);
      } catch {
        alert("Could not load this design.");
        navigate("/user/designs");
      } finally {
        setIsLoadingDesign(false);
      }
    };
    run();
  }, [designId, navigate]);

  // snapshot "after" when only overlays exist (kept for compatibility)
  useEffect(() => {
    const snap = async () => {
      if (!isVisualized || outPutImage || !canvasRef.current) return;
      await new Promise((r) => setTimeout(r, 100));
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 1.5,
      });
      setAfterPreviewUrl(canvas.toDataURL("image/jpeg", 0.92));
    };
    snap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isVisualized,
    outPutImage,
    selectedWallColor,
    selectedCeilingColor,
    selectedFloorPattern,
    masks?.wallMaskUrl,
    masks?.floorMaskUrl,
    masks?.ceilingMaskUrl,
    placedObjects,
  ]);

  // save design
  const handleSaveDesign = async () => {
    if (!outPutImage) return alert("Please generate before saving.");
    if (!designName.trim()) return alert("Give your design a name.");
    setIsSaving(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: null,
      });
      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.9);

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
        await api.put(`/designs/${designId}`, payload);
      } else {
        await api.post("/designs", payload);
      }

      alert("Design Saved Successfully!");
      navigate("/user/designs");
    } catch (err) {
      alert("Failed to save design.");
    } finally {
      setIsSaving(false);
    }
  };

  // upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toDataUrl = (f) =>
      new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(f);
      });

    const dataUrl = await toDataUrl(file);

    setImagePreview(dataUrl);
    setOutPutImage(null);
    setIsVisualized(false);
    setMasks({});
    setAfterPreviewUrl(null);
    setGeminiAnalysis(null);
    setCanGenerate(prompt.trim().length > 0);
  };

  // analyze (now returns a single styled image from backend)
  // Make sure at top:
  // import aiVisualizerService from "../services/aiVisualizerService";
  // (and that aiVisualizerService.segmentRoomMultipart exists)

  const handleVisualizeClick = async () => {
    const baseImageLocal = outPutImage || imagePreview;
    if (!baseImageLocal) return;

    setIsProcessing(true);
    setAnalyzeStatus("Preparing image…");
    setMasks({});
    setSelectedObjectId(null);

    try {
      setAnalyzeStatus("Analyzing with Gemini Nano…");
      const seg = await aiVisualizerService.analyzeRoomWithGeminiNano(baseImageLocal, prompt);

      setAnalyzeStatus("Processing analysis…");
      
      // For Gemini API analysis, just show suggestions (don't auto-generate)
      if (seg?.geminiAnalysis) {
        setGeminiAnalysis(seg);
        
        // Extract key suggestions and put them in the prompt field
        const keyPoints = seg.analysis
          .split('\n')
          .filter(line => line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.') || line.includes('3.'))
          .slice(0, 3) // Take first 3 key points
          .map(line => line.replace(/[•\-\d\.]/g, '').trim())
          .join('. ');
        
        // Create a concise prompt from the analysis
        const generatedPrompt = keyPoints || 
          `Modern interior design with warm lighting, better color coordination, improved furniture arrangement`;
          
        setPrompt(generatedPrompt);
        
        // Keep original image until user clicks Generate
        setOutPutImage(null);
        setAnalyzeStatus("✨ AI analysis complete! Generated prompt above - edit if needed, then click 'Generate'.");
        setCanGenerate(true); // Enable generate button
      } else {
        // Fallback to server-side if Gemini API failed
        if (seg?.resultImageUrl) setOutPutImage(seg.resultImageUrl);
        setGeminiAnalysis(null);
        setAnalyzeStatus("Analysis complete");
      }

      setMasks({
        wallMaskUrl: seg?.wallMaskUrl ?? null,
        floorMaskUrl: seg?.floorMaskUrl ?? null,
        ceilingMaskUrl: seg?.ceilingMaskUrl ?? null,
      });

      setIsVisualized(true);
      setShowTools(true);

      setTimeout(() => setAnalyzeStatus(""), 3000);
    } catch (err) {
      setAnalyzeStatus("");
      
      // Show more helpful error message
      const errorMessage = err.message || "AI analysis failed";
      if (errorMessage.includes("Gemini API key is not configured")) {
        alert("Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your environment variables and restart the application.");
      } else {
        alert(`AI analysis failed: ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate image using Gemini analysis suggestions
  const handelGenerate = async () => {
    if (!imagePreview) return;
    try {
      setIsProcessing(true);
      
      let promptMessage;
      
      // If we have Gemini analysis, use Gemini to create optimal prompt
      if (geminiAnalysis?.analysis) {
        try {
          const promptResult = await aiVisualizerService.generateImagePrompt(
            geminiAnalysis.analysis,
            roomStyle,
            aiStyle,
            prompt
          );
          
          if (promptResult.success) {
            promptMessage = promptResult.generationPrompt;
          } else {
            // Fallback prompt if Gemini prompt generation fails
            promptMessage = `Transform this room based on analysis: ${geminiAnalysis.analysis.substring(0, 500)}. Apply professional interior design improvements with ${roomStyle || 'modern'} style.`;
          }
        } catch (promptError) {
          // Fallback prompt
          promptMessage = `Transform this room based on analysis: ${geminiAnalysis.analysis.substring(0, 500)}. Apply professional interior design improvements.`;
        }
      } else {
        // Fallback to original prompt if no analysis
        promptMessage = `${prompt} ${
          roomStyle ? `Room Style : ${roomStyle}` : ""
        } ${aiStyle ? `AI Style : ${aiStyle}` : ""}. 
        Make sure the image is high quality (1080p), ratio 16:9, visually appealing`;
      }

      // Use Nano Banana (Gemini 2.5 Flash Image) for fast image generation
      const result = await aiVisualizerService.generateImageWithNanoBanana(
        imagePreview,
        promptMessage
      );

      setOutPutImage(result);
      setIsVisualized(true);
      setPrompt("");
      setCanGenerate(false);
    } catch (err) {
      
      // Show specific error message for quota issues
      if (err.message?.includes("quota") || err.message?.includes("billing")) {
        alert("Gemini API quota exceeded. Please check your billing at https://aistudio.google.com or upgrade your plan. For now, you can still use the detailed analysis from the 'Analyze' button.");
      } else {
        alert("AI generation failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // objects
  const updateObjectPosition = useCallback((id, newPosition) => {
    setPlacedObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, position: newPosition } : obj
      )
    );
  }, []);

  const deleteObject = (id) =>
    setPlacedObjects((prev) => prev.filter((obj) => obj.id !== id));

  const handleReset = () => {
    setSelectedWallColor("#FFFFFF");
    setSelectedCeilingColor("#FFFFFF");
    setSelectedFloorPattern(floorPatterns[0]);
    setPlacedObjects([]);
    setOutPutImage(null);
    setMasks({});
    setAfterPreviewUrl(null);
    setCanGenerate(Boolean(imagePreview) && prompt.trim().length > 0);
  };

  const handleDownloadImage = () => {
    if (!outPutImage) return alert("Please generate before downloading.");
    setSelectedObjectId(null);
    setTimeout(() => {
      html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: null,
      }).then((canvas) => {
        canvas.toBlob((blob) => saveAs(blob, "MySpaceSnap_Design.png"));
      });
    }, 80);
  };

  // tools
  const ToolsPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab("walls")}
          className={`flex items-center justify-center p-2 rounded border ${
            activeTab === "walls"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200"
          }`}
          title="Walls"
        >
          <FaPalette />
        </button>
        <button
          onClick={() => setActiveTab("floor")}
          className={`flex items-center justify-center p-2 rounded border ${
            activeTab === "floor"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200"
          }`}
          title="Floor"
        >
          <FaBorderAll />
        </button>
        <button
          onClick={() => setActiveTab("ceiling")}
          className={`flex items-center justify-center p-2 rounded border ${
            activeTab === "ceiling"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200"
          }`}
          title="Ceiling"
        >
          <FaLightbulb />
        </button>
        <button
          onClick={() => setActiveTab("objects")}
          className={`flex items-center justify-center p-2 rounded border ${
            activeTab === "objects"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200"
          }`}
          title="Objects"
        >
          <FaCouch />
        </button>
      </div>

      {/* palettes / objects */}
      <div className="space-y-4">
        {activeTab === "walls" && (
          <div className="space-y-4">
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-3">
              💡 <strong>Tip:</strong> Click any item to add it to your generation prompt
            </div>
            
            {/* Color Palettes */}
            {Object.entries(wallColorPalettes).map(([paletteName, colors]) => (
              <div key={paletteName}>
                <h4 className="font-semibold mb-2 capitalize">{paletteName}</h4>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        const colorPrompt = `Change wall color to ${c}. Modern interior design with professional styling.`;
                        setPrompt(colorPrompt);
                        setCanGenerate(Boolean(imagePreview));
                      }}
                      style={{ backgroundColor: c }}
                      className="w-9 h-9 rounded-full border-2 border-gray-200 transition-all hover:scale-110 hover:border-teal-400"
                      title={`Click to add ${c} wall color to prompt`}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Wall Objects */}
            <div>
              <h4 className="font-semibold mb-2">Wall Decorations</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(placeableObjects.wall || []).slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const objectPrompt = `Add ${item.name.toLowerCase()} to the wall. Modern interior design with professional wall decor.`;
                      setPrompt(objectPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="p-2 border border-gray-200 rounded-md hover:border-teal-400 hover:shadow transition-all"
                    title={`Click to add ${item.name} to generation prompt`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mx-auto" />
                    <span className="text-xs text-gray-700 block mt-1">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ceiling" && (
          <div className="space-y-4">
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-3">
              💡 <strong>Tip:</strong> Click any item to add it to your generation prompt
            </div>
            
            {/* Ceiling Colors */}
            {Object.entries(ceilingColorPalettes).map(
              ([paletteName, colors]) => (
                <div key={paletteName}>
                  <h4 className="font-semibold mb-2 capitalize">
                    {paletteName} Ceiling
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          const colorPrompt = `Change ceiling color to ${c}. Modern interior design with professional ceiling styling.`;
                          setPrompt(colorPrompt);
                          setCanGenerate(Boolean(imagePreview));
                        }}
                        style={{ backgroundColor: c }}
                        className="w-9 h-9 rounded-full border-2 border-gray-200 transition-all hover:scale-110 hover:border-teal-400"
                        title={`Click to add ${c} ceiling color to prompt`}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
            
            {/* Ceiling Objects */}
            <div>
              <h4 className="font-semibold mb-2">Ceiling Fixtures</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(placeableObjects.ceiling || []).slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const objectPrompt = `Add ${item.name.toLowerCase()} to the ceiling. Modern interior design with stylish lighting.`;
                      setPrompt(objectPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="p-2 border border-gray-200 rounded-md hover:border-teal-400 hover:shadow transition-all"
                    title={`Click to add ${item.name} to generation prompt`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mx-auto" />
                    <span className="text-xs text-gray-700 block mt-1">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "floor" && (
          <div className="space-y-4">
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-3">
              💡 <strong>Tip:</strong> Click any item to add it to your generation prompt
            </div>
            
            {/* Floor Patterns */}
            <div>
              <h4 className="font-semibold mb-2">Floor Patterns</h4>
              <div className="grid grid-cols-3 gap-2">
                {floorPatterns.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const floorPrompt = `Change floor to ${p.name.toLowerCase()}. Modern interior design with beautiful flooring.`;
                      setPrompt(floorPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="p-2 border border-gray-200 rounded-md hover:border-teal-400 hover:shadow transition-all"
                    title={`Click to add ${p.name} flooring to prompt`}
                  >
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-contain mx-auto" />
                    <span className="text-xs text-gray-700 block mt-1">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Floor Objects */}
            <div>
              <h4 className="font-semibold mb-2">Floor Items</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(placeableObjects.floor || []).slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const objectPrompt = `Add ${item.name.toLowerCase()} to the room. Modern interior design with stylish furniture.`;
                      setPrompt(objectPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="p-2 border border-gray-200 rounded-md hover:border-teal-400 hover:shadow transition-all"
                    title={`Click to add ${item.name} to generation prompt`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mx-auto" />
                    <span className="text-xs text-gray-700 block mt-1">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "objects" && (
          <div className="space-y-4">
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-3">
              💡 <strong>Tip:</strong> Click any object to add it to your AI generation prompt
            </div>
            
            {Object.entries(placeableObjects).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-bold capitalize mb-2">{category} Items</h4>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => {
                        const objectPrompt = `Add ${i.name.toLowerCase()} to the room. Modern interior design with stylish ${category} furniture and decor.`;
                        setPrompt(objectPrompt);
                        setCanGenerate(Boolean(imagePreview));
                      }}
                      className="p-2 border border-gray-200 rounded-md hover:border-teal-400 hover:shadow transition-all"
                      title={`Click to add ${i.name} to generation prompt`}
                    >
                      <img src={i.image} alt={i.name} className="w-12 h-12 object-contain mx-auto" />
                      <span className="text-xs text-gray-700 block mt-1">{i.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoadingDesign) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-100 via-white to-gray-100">
      {/* header */}
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded border border-gray-200"
            onClick={() => setShowTools((s) => !s)}
            aria-label="Toggle tools"
          >
            {showTools ? <FaTimes /> : <FaBars />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <FaSwatchbook className="text-teal-600" />
            <span className="font-bold">AI Room Visualizer</span>
          </div>

          <label
            htmlFor="upload-btn"
            className="cursor-pointer inline-flex items-center gap-2 bg-teal-600 text-white px-3 py-2 rounded"
          >
            <FaUpload /> <span>Upload</span>
          </label>
          <input
            id="upload-btn"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Button
            onClick={handleVisualizeClick}
            disabled={!imagePreview || isProcessing}
            className="bg-amber-500 text-white hover:bg-amber-600"
            aria-busy={isProcessing ? "true" : "false"}
          >
            <span className="inline-flex items-center gap-2">
              <FaMagic />
              <span>{isProcessing ? "Analyzing..." : "Analyze"}</span>
            </span>
          </Button>

          {analyzeStatus && (
            <span
              className="ml-2 text-sm px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 transition-opacity"
              aria-live="polite"
            >
              {analyzeStatus}
            </span>
          )}
        </div>
      </header>

      {/* content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* left tools */}
        <aside
          className={`lg:col-span-3 ${showTools ? "block" : "hidden"} lg:block`}
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-2 max-h-[calc(100vh-110px)] overflow-y-auto">
            {/* style selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-4">
              <div className="space-y-1">
                <select
                  onChange={(e) => {
                    const newRoomStyle = e.target.value;
                    setRoomStyle(newRoomStyle);
                    
                    // Auto-generate prompt when room style is selected
                    if (newRoomStyle) {
                      const styleDescriptions = {
                        'modern': 'Transform this room with modern minimalist design, clean lines, neutral colors, and sleek furniture',
                        'scandinavian': 'Apply Scandinavian style with light woods, white walls, cozy textures, and natural materials',
                        'bohemian': 'Create a bohemian eclectic space with vibrant colors, mixed patterns, and artistic elements',
                        'industrial': 'Design an industrial urban look with exposed materials, metal accents, and raw textures',
                        'traditional': 'Apply traditional classic style with elegant furniture, rich colors, and timeless elements',
                        'coastal': 'Create a coastal beach vibe with light blues, whites, natural textures, and ocean-inspired decor',
                        'rustic': 'Design a rustic farmhouse style with wood elements, vintage furniture, and cozy country charm',
                        'mid-century': 'Apply mid-century modern design with retro furniture, bold colors, and geometric patterns',
                        'art-deco': 'Create an Art Deco glam look with luxurious materials, gold accents, and geometric designs',
                        'japanese': 'Design a Japanese Zen space with minimalist elements, natural materials, and peaceful ambiance'
                      };
                      
                      const basePrompt = styleDescriptions[newRoomStyle] || `Apply ${newRoomStyle} interior design style`;
                      const fullPrompt = aiStyle ? `${basePrompt} with ${aiStyle} aesthetic rendering` : basePrompt;
                      
                      setPrompt(fullPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }
                  }}
                  value={roomStyle}
                  className="w-full rounded-lg px-3 py-2 border border-gray-300 bg-white focus:border-teal-400"
                >
                  <option value="">Select a room style</option>
                  <option value="modern">Modern & Minimalist</option>
                  <option value="scandinavian">Scandinavian</option>
                  <option value="bohemian">Bohemian & Eclectic</option>
                  <option value="industrial">Industrial & Urban</option>
                  <option value="traditional">Traditional & Classic</option>
                  <option value="coastal">Coastal & Beach</option>
                  <option value="rustic">Rustic & Farmhouse</option>
                  <option value="mid-century">Mid-Century Modern</option>
                  <option value="art-deco">Art Deco & Glam</option>
                  <option value="japanese">Japanese Zen</option>
                </select>
                {roomStyle && (
                  <div className="text-xs text-teal-600 font-medium px-1">
                    ✓ {roomStyle.charAt(0).toUpperCase() + roomStyle.slice(1)} style selected
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <select
                  value={aiStyle}
                  onChange={(e) => {
                    const newAiStyle = e.target.value;
                    setAiStyle(newAiStyle);
                    
                    // Update prompt when AI style changes
                    if (newAiStyle && roomStyle) {
                      const styleDescriptions = {
                        'modern': 'Transform this room with modern minimalist design, clean lines, neutral colors, and sleek furniture',
                        'scandinavian': 'Apply Scandinavian style with light woods, white walls, cozy textures, and natural materials',
                        'bohemian': 'Create a bohemian eclectic space with vibrant colors, mixed patterns, and artistic elements',
                        'industrial': 'Design an industrial urban look with exposed materials, metal accents, and raw textures',
                        'traditional': 'Apply traditional classic style with elegant furniture, rich colors, and timeless elements',
                        'coastal': 'Create a coastal beach vibe with light blues, whites, natural textures, and ocean-inspired decor',
                        'rustic': 'Design a rustic farmhouse style with wood elements, vintage furniture, and cozy country charm',
                        'mid-century': 'Apply mid-century modern design with retro furniture, bold colors, and geometric patterns',
                        'art-deco': 'Create an Art Deco glam look with luxurious materials, gold accents, and geometric designs',
                        'japanese': 'Design a Japanese Zen space with minimalist elements, natural materials, and peaceful ambiance'
                      };
                      
                      const basePrompt = styleDescriptions[roomStyle] || `Apply ${roomStyle} interior design style`;
                      const fullPrompt = `${basePrompt} with ${newAiStyle} aesthetic rendering`;
                      
                      setPrompt(fullPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    } else if (newAiStyle && !roomStyle) {
                      // If only AI style is selected
                      const aiStylePrompt = `Professional interior design transformation with ${newAiStyle} aesthetic rendering`;
                      setPrompt(aiStylePrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }
                  }}
                  className="w-full rounded-lg px-3 py-2 border border-gray-300 bg-white focus:border-teal-400"
                >
                  <option value="">Select an AI style</option>
                  <option value="photorealistic">Photorealistic</option>
                  <option value="artistic">Artistic & Creative</option>
                  <option value="sketch">Sketch & Line Art</option>
                  <option value="watercolor">Watercolor & Paint</option>
                  <option value="digital-art">Digital Art</option>
                  <option value="vintage">Vintage & Retro</option>
                  <option value="fantasy">Fantasy & Dreamy</option>
                  <option value="minimalist">Clean & Minimal</option>
                  <option value="luxury">Luxury & Elegant</option>
                  <option value="nature-inspired">Nature Inspired</option>
                </select>
                {aiStyle && (
                  <div className="text-xs text-teal-600 font-medium px-1">
                    ✓ {aiStyle.charAt(0).toUpperCase() + aiStyle.slice(1)} AI style selected
                  </div>
                )}
              </div>
            </div>

            {/* Style Preview */}
            {(roomStyle || aiStyle) && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-teal-800 mb-1">Current Selection:</div>
                <div className="text-xs text-teal-700">
                  {roomStyle && `🏠 ${roomStyle.replace('-', ' ')}`}
                  {roomStyle && aiStyle && ' + '}
                  {aiStyle && `🎨 ${aiStyle.replace('-', ' ')}`}
                </div>
                <div className="text-xs text-teal-600 mt-1">
                  Use "Apply Selected Styles" in the comparison panel to apply these settings
                </div>
              </div>
            )}

            {/* tools */}
            <ToolsPanel />
          </div>
        </aside>

        {/* center canvas & prompt */}
        <main className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 h-full flex flex-col gap-3">
            {/* prompt + generate (kept) */}
            <div className="bg-gray-50 rounded-lg p-3">
              <textarea
                className="w-full rounded-lg p-3 outline-none border border-gray-200 focus:border-gray-300"
                placeholder={geminiAnalysis ? 
                  "AI suggestions loaded above - edit if needed, then click Generate" : 
                  "Select styles above to auto-generate prompts, or type your own description"}
                rows="3"
                value={prompt}
                onChange={(e) => {
                  const v = e.target.value;
                  setPrompt(v);
                  setCanGenerate(Boolean(imagePreview) && v.trim().length > 0);
                }}
              />
              <button
                className="mt-2 w-full bg-white border border-gray-300 text-black font-semibold py-2 px-3 rounded-lg disabled:opacity-50"
                onClick={handelGenerate}
                disabled={!canGenerate || isProcessing}
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <span>Generate</span>
                </span>
              </button>
            </div>

            {/* canvas */}
            <div
              ref={canvasRef}
              onClick={() => setSelectedObjectId(null)}
              className="relative bg-gray-100 rounded-lg border border-gray-200 min-h-[360px] sm:min-h-[440px] md:min-h-[520px] flex items-center justify-center overflow-hidden"
            >
              {!baseImage && (
                <div className="text-center text-gray-400 flex flex-col items-center gap-2">
                  <FaUpload className="text-3xl" />
                  <p>Upload an image to start designing</p>
                </div>
              )}
              {baseImage && (
                <img
                  ref={imgRef}
                  src={baseImage}
                  alt="Your Room"
                  className="w-full h-full object-contain block"
                />
              )}

              {/* draggable objects */}
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
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <FaSpinner className="animate-spin text-3xl" />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* right: improved comparison + tools */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Before and After - Side by Side */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="mb-3">
              <h3 className="font-semibold">
                {geminiAnalysis ? "AI Comparison" : "Before & After"}
              </h3>
            </div>

            {/* Side by Side View */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Original</h4>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview || "https://placehold.co/400x400"}
                    alt="Original room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">
                  {outPutImage && outPutImage !== imagePreview ? "AI Generated" : "Preview"}
                </h4>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                  <img
                    src={outPutImage || imagePreview || "https://placehold.co/400x400"}
                    alt="Generated room"
                    className="w-full h-full object-cover"
                  />
                  
                  {!outPutImage || outPutImage === imagePreview ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-sm">
                      Click Generate to see result
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      ✨ AI Generated
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tools & Color Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="font-semibold mb-3">Quick Styling Tools</h3>
            
            {/* Color Palette */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Wall Colors</h4>
                <div className="flex gap-2 flex-wrap">
                  {Object.values(wallColorPalettes.neutral || []).slice(0, 8).map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const colorPrompt = `Change wall color to ${color}. Modern interior design with professional styling.`;
                        setPrompt(colorPrompt);
                        setCanGenerate(Boolean(imagePreview));
                      }}
                      style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      title={`Apply ${color} wall color`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const stylePrompt = `Apply ${roomStyle || 'modern'} style with ${aiStyle || 'photorealistic'} aesthetic. Professional interior design.`;
                      setPrompt(stylePrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    disabled={!roomStyle && !aiStyle}
                    className="px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    🎨 Apply Selected Styles
                  </button>
                  <button
                    onClick={() => {
                      const lightPrompt = `Improve lighting and make the room brighter with warm, professional lighting`;
                      setPrompt(lightPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="px-3 py-2 text-xs bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    💡 Better Lighting
                  </button>
                  <button
                    onClick={() => {
                      const colorPrompt = `Modernize colors and add professional color coordination`;
                      setPrompt(colorPrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    🌈 Update Colors
                  </button>
                  <button
                    onClick={() => {
                      const furniturePrompt = `Improve furniture arrangement and add modern furniture pieces`;
                      setPrompt(furniturePrompt);
                      setCanGenerate(Boolean(imagePreview));
                    }}
                    className="px-3 py-2 text-xs bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    🪑 Better Layout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 flex-1 min-h-[220px] max-h-[400px] overflow-y-auto">
            {geminiAnalysis ? (
              <>
                <h3 className="font-semibold mb-2 text-blue-600">🤖 AI Analysis Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-50 p-2 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-1">Interior Design Suggestions:</h4>
                    <div className="text-blue-700 text-xs leading-relaxed">
                      {geminiAnalysis.analysis.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();
                        
                        // Skip empty lines
                        if (!trimmedLine) {
                          return <div key={index} className="h-2"></div>;
                        }
                        
                        // Format markdown headers (## Title)
                        if (trimmedLine.startsWith('##')) {
                          const headerText = trimmedLine.replace(/^##\s*/, '');
                          return <div key={index} className="font-bold text-blue-900 text-sm mt-3 mb-2">{headerText}</div>;
                        }
                        
                        // Format numbered lists (handle incomplete markdown)
                        if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^\*\*\d+\./)) {
                          let cleanText = trimmedLine;
                          // Remove ** at beginning and end if present
                          cleanText = cleanText.replace(/^\*\*/, '').replace(/\*\*$/, '');
                          // Remove incomplete ** at end
                          cleanText = cleanText.replace(/\*\*?$/, '');
                          return <div key={index} className="font-semibold text-blue-800 mt-2 mb-1">{cleanText}</div>;
                        }
                        
                        // Format bullet points (* text)
                        if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
                          const bulletText = trimmedLine.replace(/^\*\s*/, '• ');
                          return <div key={index} className="ml-4 text-blue-600 mb-1">{bulletText}</div>;
                        }
                        
                        // Format lines with colons (section headers)
                        if (trimmedLine.endsWith(':') && trimmedLine.length < 80) {
                          const headerText = trimmedLine.replace(/^\*?\*?(.+?)(\*?\*?)?:$/, '$1:');
                          return <div key={index} className="font-semibold text-blue-800 mt-3 mb-1">{headerText}</div>;
                        }
                        
                        // Format **bold** text inline (improved regex)
                        if (trimmedLine.includes('**')) {
                          const formattedText = trimmedLine.split(/(\*\*[^*]*?\*\*)/g).map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                              const boldText = part.slice(2, -2);
                              return <span key={partIndex} className="font-semibold text-blue-800">{boldText}</span>;
                            }
                            return part;
                          });
                          return <div key={index} className="mb-1">{formattedText}</div>;
                        }
                        
                        // Regular text - clean up any remaining incomplete markdown
                        const cleanedText = trimmedLine
                          .replace(/\*\*$/, '') // Remove trailing **
                          .replace(/\*$/, '');  // Remove trailing *
                        return <div key={index} className="mb-1">{cleanedText}</div>;
                      })}
                    </div>
                  </div>
                  {geminiAnalysis.suggestions && Object.keys(geminiAnalysis.suggestions).some(key => geminiAnalysis.suggestions[key].length > 0) && (
                    <div className="bg-green-50 p-2 rounded-md">
                      <h4 className="font-medium text-green-800 mb-1">Quick Suggestions:</h4>
                      <div className="space-y-1">
                        {Object.entries(geminiAnalysis.suggestions).map(([category, items]) => 
                          items.length > 0 && (
                            <div key={category}>
                              <span className="font-medium text-green-700 capitalize text-xs">{category}: </span>
                              <span className="text-green-600 text-xs">{items.slice(0, 2).join(', ')}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-2">AI Room Analysis</h3>
                {placedObjects.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Click "Analyze" to get AI-powered room suggestions and design insights.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {placedObjects.map((obj) => (
                      <li
                        key={obj.id}
                        onClick={() => setSelectedObjectId(obj.id)}
                        className={`p-2 rounded-md text-sm flex items-center justify-between cursor-pointer ${
                          selectedObjectId === obj.id
                            ? "bg-teal-50"
                            : "hover:bg-gray-50"
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
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-2">
            <Button
              onClick={handleReset}
              disabled={!isVisualized}
              className="w-full bg-gray-500 text-white hover:bg-gray-600"
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <FaUndo /> <span>Reset Design</span>
              </span>
            </Button>

            <Button
              onClick={handleDownloadImage}
              disabled={!outPutImage}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <FaDownload /> <span>Download Image</span>
              </span>
            </Button>

            <Button
              onClick={handleSaveDesign}
              disabled={!outPutImage || isSaving}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <FaSave />
                <span>{isSaving ? "Saving..." : "Save Design"}</span>
              </span>
            </Button>

            <Button
              onClick={() => navigate("/ar-preview")}
              disabled={!isVisualized}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <FaArrowRight /> <span>View in AR</span>
              </span>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AiVisualizerPage;
