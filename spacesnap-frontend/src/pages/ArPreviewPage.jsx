// src/pages/ArPreviewPage.jsx

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Controllers, Hands, useHitTest } from '@react-three/xr';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCube, FaQrcode, FaTimes, FaVideo, FaSave } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import * as THREE from 'three';

// ===============================================
// --- Data and Components ---
// ===============================================

// --- CORRECTED: This library now matches YOUR files and uses internet images ---
const furnitureLibrary = [
  {
    id: 'sofa_modern',
    name: 'Modern Sofa',
    modelPath: '/models/sofa.glb',
    scale: 0.2,
    thumbnail: 'https://placehold.co/128x128/a3bffa/ffffff?text=Sofa'
  },
  {
    id: 'red_chair',
    name: 'Red Armchair',
    modelPath: '/models/red_chair.glb',
    scale: 0.25,
    thumbnail: 'https://placehold.co/128x128/ff7a7a/ffffff?text=Chair'
  },
  {
    id: 'sofa_set',
    name: 'Sofa & Table Set',
    modelPath: '/models/sofa_and_table.glb',
    scale: 0.2,
    thumbnail: 'https://placehold.co/128x128/7af2ff/ffffff?text=Set'
  },
  {
    id: 'canape_sofa',
    name: 'Canape Sofa',
    modelPath: '/models/canape.gltf', // .gltf is also supported
    scale: 0.15,
    thumbnail: 'https://placehold.co/128x128/b17aff/ffffff?text=Canape'
  },
  {
    id: 'classic_sofa',
    name: 'Classic Sofa',
    modelPath: '/models/sofa%20(1).glb', // The space is encoded as %20 for URL safety
    scale: 0.2,
    thumbnail: 'https://placehold.co/128x128/ffcd7a/ffffff?text=Sofa+2'
  }
];

function Model({ modelPath, ...props }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene.clone()} {...props} />;
}

function HitTestMarker() {
  const reticleRef = useRef();
  useHitTest((hitMatrix, hit) => {
    if (hit) {
      hitMatrix.decompose(reticleRef.current.position, reticleRef.current.quaternion, reticleRef.current.scale);
      reticleRef.current.visible = true;
    } else {
      reticleRef.current.visible = false;
    }
  });
  return (
    <mesh ref={reticleRef} visible={false}>
      <ringGeometry args={[0.05, 0.1, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}

const DemoVideoModal = ({ onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FaVideo /> Feature Demo</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><FaTimes size={20} /></button>
                </div>
                <video src="/hero-video.mp4" controls autoPlay muted loop className="w-full"></video>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

const DesktopPreview = ({ item }) => {
    const { id, name, thumbnail, ...modelProps } = item;
    return (
        <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls autoRotate autoRotateSpeed={1} />
            <Suspense fallback={null}>
                <Model {...modelProps} />
            </Suspense>
        </Canvas>
    );
};

// ===============================================
// --- Main Page Component ---
// ===============================================

const ArPreviewPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(furnitureLibrary[0]);
  const hitTestTargetRef = useRef(); 

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  const handlePlaceObject = () => {
      if (hitTestTargetRef.current) {
          const position = new THREE.Vector3();
          position.setFromMatrixPosition(hitTestTargetRef.current.matrix);
          setPlacedObjects(prev => [...prev, { appId: Date.now(), ...selectedObject, position: [position.x, position.y, position.z] }]);
      }
  };

  const handleSaveScene = async () => {
    if (placedObjects.length === 0) {
        alert("Your scene is empty!");
        return;
    }
    alert(`Scene saved with ${placedObjects.length} objects!`);
    console.log("Saving scene:", JSON.stringify(placedObjects, null, 2));
  };
  
  const HitTestAndPlace = () => {
    hitTestTargetRef.current = new THREE.Object3D();
    useHitTest((hitMatrix) => {
      if (hitTestTargetRef.current) {
        hitTestTargetRef.current.matrix.copy(hitMatrix);
      }
    });
    return null;
  };

  return (
    <>
      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
      
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <FaCube className="text-blue-600 text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">Augmented Reality Preview</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">See our 3D models in your own space.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="w-full h-[600px] bg-gray-100 rounded-lg shadow-inner relative" onClick={isMobile ? handlePlaceObject : undefined}>
              {isMobile ? (
                <Canvas>
                  <XR>
                    <ambientLight intensity={1.5} />
                    {placedObjects.map((obj) => (
                      <Model key={obj.appId} modelPath={obj.modelPath} position={obj.position} scale={obj.scale} />
                    ))}
                    <HitTestMarker />
                    <HitTestAndPlace />
                  </XR>
                </Canvas>
              ) : (
                <>
                  <DesktopPreview item={selectedObject} />
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4 text-center rounded-lg">
                    <FaQrcode className="text-6xl mb-4" />
                    <h3 className="text-2xl font-bold">Open on Your Phone to Use AR</h3>
                    <p className="mt-2 mb-4">Scan the QR code to experience this in your room.</p>
                    <div className="bg-white p-2 rounded-md">
                      <QRCodeCanvas value={window.location.href} size={128} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Select an Item</h2>
              <div className="flex space-x-3 overflow-x-auto pb-4">
                {furnitureLibrary.map(item => (
                  <button key={item.id} onClick={() => setSelectedObject(item)} className={`p-4 rounded-lg border-2 transition-all duration-200 shrink-0 ${selectedObject.id === item.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-400'}`}>
                    {/* CORRECTED: This now uses the internet URL from the library */}
                    <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-contain mx-auto" />
                    <p className="text-center font-semibold mt-2 text-sm text-gray-700">{item.name}</p>
                  </button>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-8">2. Place in Your Room</h2>
              <p className="text-gray-600 mb-6">{isMobile ? "Tap the 'Start AR' button, scan the floor, then tap the screen to place the selected item." : "Open this page on your phone to get started."}</p>
              
              {isMobile && (
                <div className="space-y-4">
                    <ARButton 
                        sessionInit={{ requiredFeatures: ["hit-test"] }} 
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
                    />
                    <button
                      onClick={handleSaveScene}
                      disabled={placedObjects.length === 0}
                      className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaSave /> Save Scene
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