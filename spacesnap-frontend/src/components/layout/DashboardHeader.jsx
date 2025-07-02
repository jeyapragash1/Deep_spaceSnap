// src/components/layout/DashboardHeader.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const DashboardHeader = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0">
            <div className="relative">
                <input type="text" placeholder="Search..." className="pl-4 pr-10 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-teal" />
            </div>
            <div className="flex items-center gap-6">
                <FaBell className="text-gray-500 text-xl cursor-pointer" />
                <div className="flex items-center gap-3">
                    <img src={user?.avatar || 'https://source.unsplash.com/150x150/?portrait'} alt="User Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm text-neutral-dark">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;