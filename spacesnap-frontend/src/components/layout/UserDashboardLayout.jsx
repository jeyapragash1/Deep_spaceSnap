// src/components/layout/UserDashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTachometerAlt, FaPalette, FaMagic, FaVectorSquare, FaUser, FaSignOutAlt, FaCube } from 'react-icons/fa';
import DashboardHeader from './DashboardHeader'; // The header with the user's avatar

// --- The Sidebar Component (now inside the layout file for simplicity) ---
const UserSidebar = () => {
    const { user, logout } = useAuth(); // Get the logout function and user info
    
    const navLinkClasses = ({ isActive }) => 
      `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 ${
        isActive ? 'bg-primary-teal text-white font-semibold' : 'hover:bg-teal-100 hover:text-primary-teal'
      }`;
  
    return (
      <aside className="w-64 bg-white shadow-md flex flex-col h-screen p-4">
        <div className="p-4 text-center border-b mb-4">
          <h1 className="text-3xl font-bold text-primary-teal">SpaceSnap</h1>
        </div>
        <nav className="flex-grow space-y-2">
          <NavLink to="/user/profile" end className={navLinkClasses}>
            <FaTachometerAlt className="mr-3" />Dashboard
          </NavLink>
          <NavLink to="/style-quiz" className={navLinkClasses}>
            <FaPalette className="mr-3" />Style Quiz
          </NavLink>
          <NavLink to="/visualizer" className={navLinkClasses}>
            <FaMagic className="mr-3" />AI Visualizer
          </NavLink>
          
          {/* --- This link is now conditional --- */}
          {/* It shows for premium users, but is disabled for registered users */}
          <NavLink 
            to="/ar-preview" 
            className={`${navLinkClasses({isActive: false})} ${user?.role === 'registered' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => user?.role === 'registered' && e.preventDefault()} // Prevent click if registered
          >
            <FaCube className="mr-3" />
            AR Preview
            {user?.role === 'registered' && <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PRO</span>}
          </NavLink>

          <NavLink to="/user/designs" className={navLinkClasses}>
            <FaVectorSquare className="mr-3" />My Designs
          </NavLink>
          <NavLink to="/user/account" className={navLinkClasses}>
            <FaUser className="mr-3" />Account
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700">
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </aside>
    );
  };
  

// --- The Main Layout Component ---
const UserDashboardLayout = () => {
    return (
        <div className="flex h-screen bg-neutral-light">
            <UserSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;