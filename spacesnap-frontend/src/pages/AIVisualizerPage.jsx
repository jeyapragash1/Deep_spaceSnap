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

import { generateFromHuggingFaceModel } from "../services/generate-from-hugging-face";

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

  // prefer generated image when available
  const baseImage = outPutImage || imagePreview;

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

  // save updated canvas (generated if present)
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
        thumbnail: thumbnailDataUrl, // updated
        originalImage: imagePreview, // keep original ref
      };

      if (designId) {
        await api.put(`/designs/${designId}`, payload);
      } else {
        await api.post("/designs", payload);
      }

      alert("Design Saved Successfully!");
      navigate("/user/designs");
    } catch (err) {
      console.error(err);
      alert("Failed to save design.");
    } finally {
      setIsSaving(false);
    }
  };

  // upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setOutPutImage(null);
      setIsVisualized(false);
      setMasks({});
      setCanGenerate(prompt.trim().length > 0);
    }
  };

  // analyze (segment current image)
  const handleVisualizeClick = async () => {
    if (!baseImage) return;
    setIsProcessing(true);
    try {
      const result = await aiVisualizerService.segmentRoom(baseImage);
      setMasks(result || {});
      setIsVisualized(true);
    } catch {
      alert("AI analysis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // generate (prompt untouched)
  const handelGenerate = async () => {
    if (!imagePreview) return;
    try {
      setIsProcessing(true);
      const promptMessage = `${prompt} ${
        roomStyle ? `Room Style : ${roomStyle}` : ""
      } ${aiStyle ? `AI Style : ${aiStyle}` : ""}. 
      Make sure the image is high quality (1080p), ratio 16:9, visually appealing`;

      const result = await generateFromHuggingFaceModel(
        imagePreview,
        promptMessage
      );

      setOutPutImage(result);
      setIsVisualized(true);

      // reset input, disable generate until user types again
      setPrompt("");
      setCanGenerate(false);
    } catch {
      alert("AI generation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // objects
  const addObjectToScene = (obj) => {
    const newObject = {
      ...obj,
      id: `${obj.id}_${crypto.randomUUID()}`,
      position: { x: 100, y: 100 },
    };
    setPlacedObjects((prev) => [...prev, newObject]);
  };

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
    setCanGenerate(Boolean(imagePreview) && prompt.trim().length > 0);
  };

  // download updated canvas
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

  // tools panel (left)
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

      {/* tab contents */}
      <div className="space-y-4">
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
                      className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedWallColor === c
                          ? "border-teal-500 ring-2 ring-teal-200"
                          : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ceiling" && (
          <div className="space-y-4">
            {Object.entries(ceilingColorPalettes).map(
              ([paletteName, colors]) => (
                <div key={paletteName}>
                  <h4 className="font-semibold mb-2 capitalize">
                    {paletteName}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCeilingColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedCeilingColor === c
                            ? "border-teal-500 ring-2 ring-teal-200"
                            : "border-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "floor" && (
          <div className="grid grid-cols-3 gap-2">
            {floorPatterns.map((p) => (
              <OptionButton
                key={p.id}
                {...p}
                onClick={() => setSelectedFloorPattern(p)}
              />
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
                    <OptionButton
                      key={i.id}
                      {...i}
                      onClick={() => addObjectToScene(i)}
                    />
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
            disabled={!baseImage || isProcessing}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            <span className="inline-flex items-center gap-2">
              <FaMagic />
              <span>{isProcessing ? "Analyzing..." : "Analyze"}</span>
            </span>
          </Button>
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
              <select
                onChange={(e) => setRoomStyle(e.target.value)}
                value={roomStyle}
                className="w-full rounded-lg px-3 py-2 border border-gray-300 bg-white"
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

              <select
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value)}
                className="w-full rounded-lg px-3 py-2 border border-gray-300 bg-white"
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
            </div>

            {/* tools */}
            <ToolsPanel />
          </div>
        </aside>

        {/* center canvas & prompt */}
        <main className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 h-full flex flex-col gap-3">
            {/* prompt + generate */}
            <div className="bg-gray-50 rounded-lg p-3">
              <textarea
                className="w-full rounded-lg p-3 outline-none border border-gray-200 focus:border-gray-300"
                placeholder="Describe your change (e.g., modern style, white walls)"
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

            {/* canvas (image + masks + objects) */}
            <div
              ref={canvasRef}
              onClick={() => setSelectedObjectId(null)}
              className="relative bg-gray-100 rounded-lg border border-gray-200 min-h-[360px] sm:min-h-[440px] md:min-h-[520px] flex items-center justify-center overflow-hidden"
            >
              {/* base image */}
              {!baseImage && (
                <div className="text-center text-gray-400 flex flex-col items-center gap-2">
                  <FaUpload className="text-3xl" />
                  <p>Upload an image to start designing</p>
                </div>
              )}
              {baseImage && (
                <img
                  src={baseImage}
                  alt="Your Room"
                  className="w-full h-full object-contain block"
                />
              )}

              {/* MASK OVERLAYS */}
              {isVisualized && (
                <>
                  {/* SVG masks */}
                  {(masks?.floorMask ||
                    masks?.wallMask ||
                    masks?.ceilingMask) && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 800 600"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern
                          id="floorPattern"
                          patternUnits="userSpaceOnUse"
                          width="100"
                          height="100"
                        >
                          <image
                            href={selectedFloorPattern.image}
                            width="100"
                            height="100"
                          />
                        </pattern>
                      </defs>

                      {masks?.floorMask && (
                        <path
                          d={masks.floorMask}
                          fill="url(#floorPattern)"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      )}
                      {masks?.wallMask && (
                        <path
                          d={masks.wallMask}
                          fill={selectedWallColor}
                          style={{ mixBlendMode: "multiply" }}
                        />
                      )}
                      {masks?.ceilingMask && (
                        <path
                          d={masks.ceilingMask}
                          fill={selectedCeilingColor}
                          style={{ mixBlendMode: "multiply" }}
                        />
                      )}
                    </svg>
                  )}

                  {/* PNG masks (if your backend returns mask pngs later) */}
                  {(masks?.floorMaskUrl ||
                    masks?.wallMaskUrl ||
                    masks?.ceilingMaskUrl) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {masks?.floorMaskUrl && (
                        <div
                          className="absolute inset-0"
                          style={{
                            WebkitMaskImage: `url(${masks.floorMaskUrl})`,
                            maskImage: `url(${masks.floorMaskUrl})`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            backgroundImage: `url(${selectedFloorPattern.image})`,
                            backgroundRepeat: "repeat",
                            mixBlendMode: "multiply",
                          }}
                        />
                      )}
                      {masks?.wallMaskUrl && (
                        <div
                          className="absolute inset-0"
                          style={{
                            WebkitMaskImage: `url(${masks.wallMaskUrl})`,
                            maskImage: `url(${masks.wallMaskUrl})`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            backgroundColor: selectedWallColor,
                            mixBlendMode: "multiply",
                          }}
                        />
                      )}
                      {masks?.ceilingMaskUrl && (
                        <div
                          className="absolute inset-0"
                          style={{
                            WebkitMaskImage: `url(${masks.ceilingMaskUrl})`,
                            maskImage: `url(${masks.ceilingMaskUrl})`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            backgroundColor: selectedCeilingColor,
                            mixBlendMode: "multiply",
                          }}
                        />
                      )}
                    </div>
                  )}
                </>
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

              {/* processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <FaSpinner className="animate-spin text-3xl" />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* right: before/after + layers + actions */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* BEFORE / AFTER — no extra space */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-3 pt-3">
              <h3 className="font-semibold">After / Before</h3>
            </div>

            {/* Fixed aspect ratio ensures both fill equally */}
            <div className="rounded-b-xl overflow-hidden aspect-[16/9] sm:aspect-[4/3]">
              <div className="w-full h-full before-after-same">
                <ReactBeforeSliderComponent
                  firstImage={{
                    imageUrl: imagePreview || "https://placehold.co/800x600",
                  }}
                  secondImage={{
                    imageUrl: outPutImage || "https://placehold.co/800x600",
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
          {/* Layers */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 flex-1 min-h-[220px]">
            <h3 className="font-semibold mb-2">Design Layers</h3>
            {placedObjects.length === 0 ? (
              <p className="text-xs text-gray-500">
                Add objects to see them here.
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
          </div>

          {/* Actions — aligned icons */}
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
