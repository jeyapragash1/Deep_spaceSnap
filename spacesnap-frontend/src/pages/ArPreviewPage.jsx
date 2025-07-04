// src/pages/ArPreviewPage.jsx

import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Controllers, Hands, useHitTest } from '@react-three/xr'; // Correct import for v5
import { useGLTF, Environment } from '@react-three/drei';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCube, FaHandPointer } from 'react-icons/fa';

// --- 3D MODEL COMPONENT ---
function SofaModel(props) {
  const { scene } = useGLTF('/models/sofa.glb'); 
  return <primitive object={scene} {...props} />;
}


// --- THIS IS THE NEW, CORRECT HIT-TESTING COMPONENT ---
// This component will show a small ring on any surface the user's camera detects.
function HitTestMarker({ onHit }) {
    const hitTestRef = useRef();

    // The useHitTest hook continuously checks for surfaces.
    // When a surface is found, it updates the position and rotation of our marker.
    useHitTest((hitMatrix) => {
        hitMatrix.decompose(
            hitTestRef.current.position,
            hitTestRef.current.quaternion,
            hitTestRef.current.scale
        );
        // We pass the hit matrix up to the parent component so it knows where to place the sofa.
        onHit(hitMatrix);
    });

    // This is the visual marker (a ring) that the user sees.
    return (
        <mesh ref={hitTestRef}>
            <ringGeometry args={[0.05, 0.1, 32]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
}


// --- AR SCENE COMPONENT ---
function ArExperience() {
  const [placedObjects, setPlacedObjects] = useState([]);
  const lastHitMatrix = useRef();

  const handlePlaceObject = () => {
    if (lastHitMatrix.current) {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      
      lastHitMatrix.current.decompose(position, quaternion, scale);

      const newObject = {
        id: Date.now(),
        position: [position.x, position.y, position.z],
        scale: 0.2,
      };
      setPlacedObjects([...placedObjects, newObject]);
    }
  };

  return (
    // We add the onClick handler to the main Canvas component
    <div onClick={handlePlaceObject} style={{ width: '100%', height: '100%' }}>
      <ARButton sessionInit={{ requiredFeatures: ["hit-test"] }} className="ar-button" />
      <Canvas>
        <XR>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          
          {/* This is our marker component. It updates the lastHitMatrix ref. */}
          <HitTestMarker onHit={(matrix) => (lastHitMatrix.current = matrix)} />

          <Controllers />
          <Hands />
          
          <Suspense fallback={null}>
            {placedObjects.map(obj => (
              <SofaModel key={obj.id} scale={obj.scale} position={obj.position} />
            ))}
            <Environment preset="city" />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}
  
// --- THE MAIN PAGE COMPONENT ---
const ArPreviewPage = () => {
    return (
        <MainLayout>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <FaCube className="text-primary-teal text-6xl mx-auto mb-4" />
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-dark mb-4">Augmented Reality Preview</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Stop guessing. Start seeing. Use your phone's camera to place 3D models right in your room.</p>
                    </motion.div>
                    <div className="text-center p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md mb-12">
                        <FaMobileAlt className="inline-block mr-3 text-2xl" />
                        For the best experience, please use a modern smartphone that supports WebXR.
                    </div>
                    <div className="w-full h-[500px] bg-gray-200 rounded-lg shadow-inner relative">
                      <ArExperience />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-16">
                        <div className="p-6">
                            <FaHandPointer className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">1. Enter AR</h3>
                            <p className="text-gray-600">Tap the "Enter AR" button that appears on the scene above.</p>
                        </div>
                        <div className="p-6">
                            <FaCube className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">2. Find a Surface</h3>
                            <p className="text-gray-600">Move your phone around to scan the floor until a white ring appears.</p>
                        </div>
                        <div className="p-6">
                            <FaCube className="text-accent-gold text-5xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">3. Tap to Place</h3>
                            <p className="text-gray-600">Tap anywhere on the screen to place the 3D sofa where the ring is.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ArPreviewPage;