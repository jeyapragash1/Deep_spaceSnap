// src/components/layout/UserDashboardLayout.jsx

import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Palette,
  Sparkles,
  Camera,
  FolderKanban,
  User,
  LogOut,
  Home,
  Briefcase,
  BarChart2,
  Settings,
  Lock
} from 'lucide-react';

// Reusable Sidebar Link Component
const SidebarLink = ({ to, icon, children, isLocked }) => {
  // If the link is locked, it redirects to the upgrade page
  if (isLocked) {
    return (
      <Link
        to="/upgrade"
        className="flex items-center px-4 py-3 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed hover:bg-gray-200 relative"
      >
        {icon}
        <span className="ml-3 font-medium">{children}</span>
        <span className="ml-auto text-yellow-800">
          <Lock size={14} />
        </span>
      </Link>
    );
  }

  // If the link is not locked, it behaves as a normal NavLink
  return (
    <NavLink
      to={to}
      end // Use 'end' for the Dashboard link to avoid it staying active
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 font-medium ${
          isActive ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      {icon}
      <span className="ml-3">{children}</span>
    </NavLink>
  );
};

const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- THIS IS THE KEY LOGIC ---
  // A simple boolean to check if the user is premium or higher
  const isPremiumOrHigher = user?.subscription === 'premium' || user?.role === 'designer' || user?.role === 'admin';

  // --- Sidebar Links based on User Role ---
  const getUserLinks = () => [
    { to: '/user/profile', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/style-quiz', icon: <Palette size={20} />, label: 'Style Quiz' },
    // --- THIS IS THE FIX ---
    // Both Visualizer and Room Preview are locked if the user is NOT premium or higher
    { to: '/visualizer', icon: <Sparkles size={20} />, label: 'AI Visualizer', isLocked: !isPremiumOrHigher },
    { to: '/ar-preview', icon: <Camera size={20} />, label: 'Scan & Reimagine AR', isLocked: !isPremiumOrHigher },
    // --- END OF FIX ---
    // { to: '/user/designs', icon: <FolderKanban size={20} />, label: 'My Designs' },
    { to: '/user/account', icon: <Settings size={20} />, label: 'Account' },
  ];

   const getDesignerLinks = () => [
    { to: '/designer/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/designer/content', icon: <Briefcase size={20} />, label: 'My Content' },
    { to: '/designer/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { to: '/designer/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const links = user?.role === 'designer' ? getDesignerLinks() : getUserLinks();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- Sidebar --- */}
      <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col p-4">
        <Link to="/" className="text-2xl font-bold text-gray-800 mb-8 px-4 flex items-center gap-2">
          <Sparkles className="text-blue-600"/>
          <span>SpaceSnap</span>
        </Link>

        <nav className="flex-grow space-y-2">
          {links.map((link) => (
            <SidebarLink key={link.label} to={link.to} icon={link.icon} isLocked={link.isLocked}>
              {link.label}
            </SidebarLink>
          ))}
        </nav>

        {/* --- Bottom Sidebar Actions --- */}
        <div className="pt-4 mt-auto border-t">
          <SidebarLink to="/" icon={<Home size={20} />}>Back to Home</SidebarLink>
          <button
            onClick={handleLogout}
            className="flex items-center w-full mt-2 px-4 py-3 text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user?.name || 'User'}</span>
              <img src={user?.avatar || '/default-avatar.png'} alt="User Avatar" className="w-8 h-8 rounded-full" />
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;