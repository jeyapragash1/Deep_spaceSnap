// src/pages/AIVisualizerPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { styles } from '../data/quizData'; // We reuse our style data
import Button from '../components/common/Button';
import { FaUpload, FaPalette } from 'react-icons/fa';

const AIVisualizerPage = () => {
  // This hook lets us read the URL's query parameters (e.g., ?style=modern)
  const [searchParams] = useSearchParams();
  const styleFromQuiz = searchParams.get('style'); // This will be 'modern', 'bohemian', etc.

  const [suggestedStyle, setSuggestedStyle] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default to white
  const [roomImage, setRoomImage] = useState(null);

  // When the page loads, check if a style was passed from the quiz
  useEffect(() => {
    if (styleFromQuiz && styles[styleFromQuiz]) {
      const styleData = styles[styleFromQuiz];
      setSuggestedStyle(styleData);
      // Automatically select the first recommended color for that style
      if (styleData.keyElements.includes("Neutral Colors")) setSelectedColor('#E5E7EB'); // A light gray
      if (styleData.keyElements.includes("Rich Patterns")) setSelectedColor('#8B4513'); // A saddle brown
    }
  }, [styleFromQuiz]);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setRoomImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-neutral-dark text-center mb-2">AI Room Visualizer</h1>
        <p className="text-center text-gray-600 mb-8">Upload a photo of your room to see the magic happen.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- Column 1: Controls & Suggestions --- */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label htmlFor="image-upload" className="w-full">
                <Button as="span" className="w-full flex items-center justify-center">
                    <FaUpload className="mr-2" /> Upload Your Room
                </Button>
              </label>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Color Palette */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center"><FaPalette className="mr-2 text-primary-teal" /> Wall Color</h3>
                <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-10 p-1 border rounded-lg" />
            </div>

            {/* Dynamic Suggestions from Quiz */}
            {suggestedStyle && (
              <div className="mt-8 p-4 bg-neutral-light rounded-lg">
                <h3 className="font-bold text-neutral-dark">Style Suggestion from Quiz:</h3>
                <p className="text-lg font-semibold text-primary-teal">{suggestedStyle.name}</p>
                <p className="text-sm text-gray-600">{suggestedStyle.description}</p>
              </div>
            )}
          </div>

          {/* --- Column 2: The Visualizer Area --- */}
          <div className="md:col-span-2 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center min-h-[500px] relative overflow-hidden">
            {roomImage ? (
              <>
                <img src={roomImage} alt="User's room" className="w-full h-full object-contain" />
                {/* This is where the AI magic happens. We simulate it with a colored overlay. */}
                <div 
                  className="absolute inset-0 mix-blend-multiply" 
                  style={{ backgroundColor: selectedColor }}
                ></div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Please upload an image of your room to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIVisualizerPage;