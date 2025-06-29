// src/pages/dashboard/MyDesignsPage.jsx
import React from 'react';
import design1 from '../../assets/images/in2.jpg';
import design2 from '../../assets/images/in3.jpg';

const savedDesigns = [
  { id: 1, name: "Living Room - Modern Look", date: "2024-07-20", image: design1 },
  { id: 2, name: "Bedroom - Cozy Neutrals", date: "2024-07-18", image: design2 },
];

const MyDesignsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Saved Designs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedDesigns.map(design => (
          <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <img src={design.image} alt={design.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{design.name}</h2>
              <p className="text-sm text-gray-500">Saved on: {design.date}</p>
            </div>
          </div>
        ))}
        {/* Placeholder for new design */}
        <div className="border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 h-64 hover:bg-gray-100 cursor-pointer">
          + Create a New Design
        </div>
      </div>
    </div>
  );
};
export default MyDesignsPage;