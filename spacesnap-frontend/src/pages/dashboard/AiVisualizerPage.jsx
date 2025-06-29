// src/pages/dashboard/AiVisualizerPage.jsx
import React from 'react';
import { FaPaintRoller, FaCouch, FaSave } from 'react-icons/fa';
import Button from '../../components/common/Button';
import livingRoomImage from '../../assets/images/in1.jpg'; // We need a placeholder image

const AiVisualizerPage = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]"> {/* Full height minus padding */}
      {/* Controls Sidebar */}
      <aside className="w-80 bg-white p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold border-b pb-4 mb-4">Design Controls</h2>
        <div className="flex-grow space-y-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center"><FaPaintRoller className="mr-2"/> Wall Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer border-2 border-primary-teal"></div>
              <div className="w-10 h-10 rounded-full bg-blue-200 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-green-200 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-yellow-200 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-red-200 cursor-pointer"></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center"><FaCouch className="mr-2"/> Furniture</h3>
            <select className="w-full p-2 border rounded-md">
              <option>Modern Sofa</option>
              <option>Rustic Coffee Table</option>
              <option>Minimalist Lamp</option>
            </select>
          </div>
        </div>
        <Button className="w-full flex items-center justify-center">
          <FaSave className="mr-2" /> Save Design
        </Button>
      </aside>

      {/* Main Image View */}
      <main className="flex-1 bg-gray-200 p-6 flex items-center justify-center">
        <div className="w-full h-full bg-white shadow-inner rounded-lg overflow-hidden">
          <p className="text-center p-4 bg-yellow-100 text-yellow-800">IMAGE UPLOAD & AI PROCESSING AREA</p>
          <img src={livingRoomImage} alt="Living room visualization" className="w-full h-full object-contain" />
        </div>
      </main>
    </div>
  );
};

export default AiVisualizerPage;