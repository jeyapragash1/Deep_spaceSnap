// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaPalette, FaMagic, FaVectorSquare, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const navLinkClasses = ({ isActive }) => 
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-primary-teal text-white' : 'text-gray-600 hover:bg-teal-100 hover:text-primary-teal'
    }`;

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
      <div className="p-6 text-center border-b">
        <h1 className="text-3xl font-bold text-primary-teal">SpaceSnap</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink to="/dashboard" end className={navLinkClasses}><FaTachometerAlt className="mr-3" />Dashboard</NavLink>
        <NavLink to="/dashboard/style-quiz" className={navLinkClasses}><FaPalette className="mr-3" />Style Quiz</NavLink>
        <NavLink to="/dashboard/visualizer" className={navLinkClasses}><FaMagic className="mr-3" />AI Visualizer</NavLink>
        <NavLink to="/dashboard/my-designs" className={navLinkClasses}><FaVectorSquare className="mr-3" />My Designs</NavLink>
        <NavLink to="/dashboard/account" className={navLinkClasses}><FaUser className="mr-3" />Account</NavLink>
      </nav>
      <div className="p-4 border-t">
        <button onClick={onLogout} className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700">
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;