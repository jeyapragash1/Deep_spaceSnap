// src/components/layout/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaUserCheck, FaEdit, FaCog, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = () => {
    const navLinkClasses = ({ isActive }) => 
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-neutral-dark text-white flex flex-col h-screen p-4">
        <div className="p-4 text-center border-b border-gray-700 mb-4">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400">SpaceSnap</p>
        </div>
        <nav className="flex-grow space-y-2">
            <NavLink to="/admin" end className={navLinkClasses}><FaTachometerAlt className="mr-3" />Dashboard</NavLink>
            <NavLink to="/admin/users" className={navLinkClasses}><FaUsers className="mr-3" />User Management</NavLink>
            <NavLink to="/admin/approvals" className={navLinkClasses}><FaUserCheck className="mr-3" />Designer Approvals</NavLink>
            <NavLink to="/admin/content" className={navLinkClasses}><FaEdit className="mr-3" />Content Moderation</NavLink>
            <NavLink to="/admin/settings" className={navLinkClasses}><FaCog className="mr-3" />System Settings</NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <NavLink to="/" className="w-full flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900 hover:text-white">
                <FaSignOutAlt className="mr-3" /> Logout & Back to Site
            </NavLink>
        </div>
    </aside>
  );
};

export default AdminSidebar;