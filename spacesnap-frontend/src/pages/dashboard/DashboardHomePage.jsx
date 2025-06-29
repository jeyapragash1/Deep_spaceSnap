// src/pages/dashboard/DashboardHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaMagic, FaVectorSquare, FaUserShield } from 'react-icons/fa'; // Added FaUserShield for admin

const DashboardHomePage = () => {
  const [user, setUser] = useState(null);

  // This hook runs when the component loads
  useEffect(() => {
    // Retrieve the user data string from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse the string back into an object and save it in state
      setUser(JSON.parse(storedUser));
    }
  }, []); // The empty array [] means this runs only once

  return (
    <div>
      <h1 className="text-4xl font-bold text-neutral-dark mb-2">
        Welcome, {user ? user.name : 'User'}!
      </h1>

      {/* This block will only render if the user object has been loaded */}
      {user && (
        <p className="text-gray-600 mb-8">
          Your current role is: 
          <span className="font-bold text-primary-teal capitalize ml-2 p-2 bg-teal-100 rounded-md">
            {user.role.replace('_', ' ')}
          </span>
        </p>
      )}
      
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

        {/* --- ADDED: Conditional Admin Panel Link --- */}
        {/* This link will ONLY be visible if the user's role is 'admin' */}
        {user && user.role === 'admin' && (
            <Link to="/admin/panel" className="bg-red-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all md:col-span-3">
                <FaUserShield className="text-5xl mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Access Admin Panel</h2>
                <p>Manage users, content, and system settings.</p>
            </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardHomePage;