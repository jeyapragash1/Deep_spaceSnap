// src/pages/ArPreviewPage.jsx

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Controllers, Hands, useHitTest } from '@react-three/xr';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FaCube, FaQrcode } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import * as THREE from 'three';

// --- NEW: Import the Google AI SDK ---
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- 3D MODEL COMPONENT ---
// --- MODIFIED: Added a 'name' prop for the AI to identify it ---
function SofaModel(props) {
  const { scene } = useGLTF('/models/sofa.glb'); 
  return <primitive object={scene} {...props} />;
}
SofaModel.displayName = "Sofa"; // This name will be used by the AI

// --- AR HIT-TEST MARKER ---
function HitTestMarker({ onHit }) {
    // (This component is unchanged)
    const hitTestRef = useRef(null);
    useHitTest((hitMatrix) => {
        hitMatrix.decompose(hitTestRef.current.position, hitTestRef.current.quaternion, hitTestRef.current.scale);
        onHit(hitMatrix);
    });
    return (
        <mesh ref={hitTestRef}>
            <ringGeometry args={[0.05, 0.1, 32]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
}

// --- FULL AR SCENE (for mobile) ---
// --- MODIFIED: Passed down the placedObjects state and the setter function ---
function ArExperience({ placedObjects, setPlacedObjects }) {
  const lastHitMatrix = useRef(null);

  const handlePlaceObject = () => {
    if (lastHitMatrix.current) {
      const position = new THREE.Vector3(); const quaternion = new THREE.Quaternion(); const scale = new THREE.Vector3();
      lastHitMatrix.current.decompose(position, quaternion, scale);
      const newObject = { 
        id: Date.now(), 
        name: SofaModel.displayName, // Give the object a name
        position: [position.x, position.y, position.z], 
        scale: 0.2 
      };
      setPlacedObjects([...placedObjects, newObject]);
    }
  };

  return (
    <div onClick={handlePlaceObject} style={{ width: '100%', height: '100%' }}>
      <ARButton sessionInit={{ requiredFeatures: ["hit-test"] }} className="ar-button" />
      <Canvas>
        <XR>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <HitTestMarker onHit={(matrix) => (lastHitMatrix.current = matrix)} />
          <Controllers /> <Hands />
          <Suspense fallback={null}>
            {placedObjects.map(obj => (<SofaModel key={obj.id} scale={obj.scale} position={obj.position} />))}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

// --- 3D PREVIEW SCENE (for desktop) ---
function DesktopPreview() {
    // (This component is unchanged)
    return (
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
                <SofaModel />
            </Suspense>
            <OrbitControls autoRotate />
        </Canvas>
    )
}

// --- NEW: A Modal component to display the AI summary ---
function AISummaryModal({ summary, isLoading, error, onClose }) {
    if (!summary && !isLoading && !error) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">×</button>
                <h3 className="text-2xl font-bold text-primary-teal mb-4">AI Design Review</h3>
                {isLoading && <p className="text-lg text-gray-600">Our AI is analyzing your design...</p>}
                {error && <p className="text-lg text-red-500">Error: {error}</p>}
                {summary && <p className="text-md text-gray-700 text-left whitespace-pre-wrap">{summary}</p>}
            </div>
        </div>
    );
}

// --- THE MAIN PAGE COMPONENT ---
const ArPreviewPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    // --- MODIFIED: Moved placedObjects state here to be shared ---
    const [placedObjects, setPlacedObjects] = useState([]);

    // --- NEW: State for the AI summary feature ---
    const [aiSummary, setAiSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    
    // --- NEW: Put your Gemini API Key here ---
    const API_KEY = "AIzaSyB62o0lV0qWc-y06Au5ytd3HWqh9SILdhU";
    const genAI = new GoogleGenerativeAI(API_KEY);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        setIsMobile(mobileRegex.test(userAgent));
    }, []);
    
    // --- NEW: Function to call the Gemini AI ---
    const handleGenerateSummary = async () => {
        if (placedObjects.length === 0) {
            setError("Place at least one object in AR before getting a review.");
            return;
        }

        setIsGenerating(true);
        setError('');
        setAiSummary('');

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        
        const objectList = placedObjects.map(obj => obj.name).join(', '); // e.g., "Sofa, Sofa, Chair"

        const prompt = `You are a friendly and helpful interior design assistant for a web app called SpaceSnap. A user has placed the following items in their room using augmented reality: ${objectList}.
        
        Write a brief, encouraging, and creative design summary (2-3 sentences). Compliment their choices and suggest a next step or a complementary item. Speak directly to the user. For example, "You've made a great start by adding...".`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            setAiSummary(text);
        } catch (e) {
            console.error(e);
            setError("Sorry, the AI is unable to respond right now.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <AISummaryModal 
                summary={aiSummary} 
                isLoading={isGenerating} 
                error={error} 
                onClose={() => { setAiSummary(''); setError(''); }}
            />
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <FaCube className="text-primary-teal text-6xl mx-auto mb-4" />
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">Augmented Reality Preview</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">See our 3D models in your own space using your phone's camera.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="w-full h-[500px] bg-gray-200 rounded-lg shadow-inner relative">
                            {isMobile ? (
                                // --- MODIFIED: Pass state down to the AR component ---
                                <ArExperience placedObjects={placedObjects} setPlacedObjects={setPlacedObjects} />
                            ) : (
                                <>
                                    <DesktopPreview />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4 text-center rounded-lg">
                                        <FaQrcode className="text-6xl mb-4" />
                                        <h3 className="text-2xl font-bold">Open on Your Phone to Use AR</h3>
                                        <p className="mt-2 mb-4">Scan the QR code with your mobile device to experience this in your room.</p>
                                        <div className="bg-white p-2 rounded-md">
                                            <QRCodeCanvas value={window.location.href} size={128} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-6">
                             <h2 className="text-3xl font-bold text-neutral-dark mb-4">How It Works</h2>
                             <ul className="space-y-4 text-lg text-gray-700">
                                {/* ... (How it works list is unchanged) ... */}
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary-teal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                                    <div><span className="font-semibold">Enter AR Mode</span><br/>On your phone, tap the "Enter AR" button.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary-teal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                                    <div><span className="font-semibold">Find a Surface</span><br/>Move your phone around to scan the floor until a white ring appears.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-primary-teal text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                                    <div><span className="font-semibold">Tap to Place</span><br/>Tap your screen to place the 3D object on the detected surface.</div>
                                </li>
                             </ul>
                             {/* --- NEW: The AI Summary Button --- */}
                             {isMobile && (
                                <div className="mt-8">
                                    <button 
                                        onClick={handleGenerateSummary} 
                                        disabled={isGenerating}
                                        className="w-full bg-primary-teal text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300 disabled:bg-gray-400"
                                    >
                                        {isGenerating ? "AI is Thinking..." : "Get AI Design Review"}
                                    </button>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArPreviewPage;