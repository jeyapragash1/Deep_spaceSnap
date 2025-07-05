// src/components/layout/UserDashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom'; // <-- IMPORT Outlet
import { useAuth } from '../../context/AuthContext';
import { FaTachometerAlt, FaPalette, FaMagic, FaVectorSquare, FaUser, FaSignOutAlt, FaCube, FaLock } from 'react-icons/fa';
import DashboardHeader from './DashboardHeader';

// --- The Sidebar Component ---
const UserSidebar = () => {
    const { user, logout } = useAuth();
    const navLinkClasses = ({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 ${isActive ? 'bg-primary-teal text-white font-semibold' : 'hover:bg-teal-100 hover:text-primary-teal'}`;
  
    return (
      <aside className="w-64 bg-white shadow-md flex flex-col h-screen p-4 flex-shrink-0">
        <div className="p-4 text-center border-b mb-4"><h1 className="text-3xl font-bold text-primary-teal">SpaceSnap</h1></div>
        <nav className="flex-grow space-y-2">
            <NavLink to="/user/profile" end className={navLinkClasses}><FaTachometerAlt className="mr-3" />Dashboard</NavLink>
            <NavLink to="/style-quiz" className={navLinkClasses}><FaPalette className="mr-3" />Style Quiz</NavLink>
            <NavLink to="/visualizer" className={navLinkClasses}><FaMagic className="mr-3" />AI Visualizer</NavLink>
            
            {user?.role === 'registered' ? (
                <Link to="/upgrade" className={`${navLinkClasses({isActive: false})} opacity-60`}>
                    <FaLock className="mr-3" />AR Preview
                    <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PRO</span>
                </Link>
            ) : (
                <NavLink to="/ar-preview" className={navLinkClasses}><FaCube className="mr-3" />AR Preview</NavLink>
            )}

            <NavLink to="/user/designs" className={navLinkClasses}><FaVectorSquare className="mr-3" />My Designs</NavLink>
            <NavLink to="/user/account" className={navLinkClasses}><FaUser className="mr-3" />Account</NavLink>
        </nav>
        <div className="p-4 border-t"><button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700"><FaSignOutAlt className="mr-3" /> Logout</button></div>
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
                    {/* --- THIS IS THE FIX --- */}
                    {/* The <Outlet /> tells React Router where to render the child pages */}
                    {/* (e.g., UserProfilePage, DesignerDashboardPage, etc.) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;