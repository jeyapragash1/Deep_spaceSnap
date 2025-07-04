// src/pages/ArPreviewPage.jsx

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Controllers, Hands, useHitTest } from '@react-three/xr';
import { useGLTF, OrbitControls } from '@react-three/drei'; // We no longer need Environment
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCube, FaQrcode, FaHandPointer } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import * as THREE from 'three';

// --- 3D MODEL COMPONENT (No changes needed) ---
function SofaModel(props) {
  const { scene } = useGLTF('/models/sofa.glb'); 
  return <primitive object={scene} {...props} />;
}

// --- AR HIT-TEST MARKER (No changes needed) ---
function HitTestMarker({ onHit }) {
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
function ArExperience() {
  const [placedObjects, setPlacedObjects] = useState([]);
  const lastHitMatrix = useRef(null);
  const handlePlaceObject = () => {
    if (lastHitMatrix.current) {
      const position = new THREE.Vector3(); const quaternion = new THREE.Quaternion(); const scale = new THREE.Vector3();
      lastHitMatrix.current.decompose(position, quaternion, scale);
      const newObject = { id: Date.now(), position: [position.x, position.y, position.z], scale: 0.2 };
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
            {/* --- THIS IS THE FIX: The <Environment> component has been REMOVED --- */}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

// --- 3D PREVIEW SCENE (for desktop) ---
function DesktopPreview() {
    return (
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
                <SofaModel />
            </Suspense>
            <OrbitControls autoRotate />
            {/* --- THIS IS THE FIX: The <Environment> component has been REMOVED --- */}
        </Canvas>
    )
}

// --- THE MAIN PAGE COMPONENT ---
const ArPreviewPage = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        setIsMobile(mobileRegex.test(userAgent));
    }, []);

    return (
        <MainLayout>
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
                                <ArExperience />
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
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ArPreviewPage;