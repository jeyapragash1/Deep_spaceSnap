// src/pages/dashboard/DashboardHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaMagic, FaVectorSquare } from 'react-icons/fa';

const DashboardHomePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-neutral-dark mb-2">Welcome to Your Dashboard</h1>
      <p className="text-gray-600 mb-8">This is your creative hub. Get started below.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Style Quiz */}
        <Link to="/dashboard/style-quiz" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <FaPalette className="text-5xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-dark mb-2">Start the Style Quiz</h2>
          <p className="text-gray-600">Discover your personal aesthetic and get tailored recommendations.</p>
        </Link>

        {/* Card 2: AI Visualizer */}
        <Link to="/dashboard/visualizer" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <FaMagic className="text-5xl text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-dark mb-2">Launch AI Visualizer</h2>
          <p className="text-gray-600">Upload a photo of your room and start designing with our AI tools.</p>
        </Link>
        
        {/* Card 3: My Designs */}
        <Link to="/dashboard/my-designs" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <FaVectorSquare className="text-5xl text-purple-500 mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-dark mb-2">View My Designs</h2>
          <p className="text-gray-600">Access all your saved projects and continue your work.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHomePage;