// spacesnap-frontend/src/components/layout/AdminDashboardLayout.jsx

import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, UserCheck, ShieldCheck, Settings, LogOut, Home, Sparkles, LayoutGrid } from 'lucide-react'; // <-- IMPORT LayoutGrid

const AdminSidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 font-medium ${
        isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

const AdminDashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col p-4">
                <Link to="/admin" className="text-2xl font-bold text-gray-800 mb-8 px-4 flex items-center gap-2">
                    <Sparkles className="text-indigo-600"/>
                    <span>SpaceSnap</span>
                    <span className="text-xs bg-indigo-100 text-indigo-600 font-bold p-1 rounded">ADMIN</span>
                </Link>
                <nav className="flex-grow space-y-2">
                    <AdminSidebarLink to="/admin" icon={<LayoutDashboard size={20} />}>Overview</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/users" icon={<Users size={20} />}>Users</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/approvals" icon={<UserCheck size={20} />}>Approvals</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/content" icon={<ShieldCheck size={20} />}>Content</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/portfolio" icon={<LayoutGrid size={20} />}>Portfolio</AdminSidebarLink> {/* <-- ADD THIS LINE */}
                    <AdminSidebarLink to="/admin/settings" icon={<Settings size={20} />}>Settings</AdminSidebarLink>
                </nav>
                <div className="pt-4 border-t">
                    <AdminSidebarLink to="/" icon={<Home size={20} />}>Home Page</AdminSidebarLink>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full mt-2 px-4 py-3 text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center px-6">
                    <h1 className="text-xl font-semibold text-gray-900">Admin Control Panel</h1>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;