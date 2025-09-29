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
  Settings
} from 'lucide-react';

// Reusable Sidebar Link Component
const SidebarLink = ({ to, icon, children, isLocked }) => {
  if (isLocked) {
    return (
      <Link
        to="/upgrade"
        className="flex items-center px-4 py-3 text-gray-500 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
      >
        {icon}
        <span className="ml-3 font-medium">{children}</span>
        <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">PRO</span>
      </Link>
    );
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 font-medium ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
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

  // --- Sidebar Links based on User Role ---
  const getUserLinks = () => {
    const isRegistered = user?.role === 'registered';
    return [
      { to: '/user/profile', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { to: '/style-quiz', icon: <Palette size={20} />, label: 'Style Quiz' },
      { to: '/visualizer', icon: <Sparkles size={20} />, label: 'AI Visualizer' },
      { to: '/ar-preview', icon: <Camera size={20} />, label: 'AR Preview', isLocked: isRegistered },
      { to: '/user/designs', icon: <FolderKanban size={20} />, label: 'My Designs' },
      { to: '/user/account', icon: <Settings size={20} />, label: 'Account' },
    ];
  };

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
        <div className="pt-4 border-t">
          <SidebarLink to="/" icon={<Home size={20} />}>Home Page</SidebarLink>
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
        <header className="bg-white border-b h-16 flex items-center px-6">
            <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {user?.name || 'User'}!
            </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;