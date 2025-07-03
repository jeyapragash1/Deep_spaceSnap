// src/components/layout/DashboardHeader.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell } from 'react-icons/fa';

// --- THIS IS THE FIX: We use the correct relative path (../..) ---
// This tells the code to go up two folders to find the 'assets' directory.
import defaultAvatar from '../../assets/images/default-avatar.png';

const DashboardHeader = () => {
    const { user } = useAuth();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-10">
            {/* You can add a welcome message or search bar here later */}
            <div>
                 <p className="text-gray-500 text-sm">{today}</p>
            </div>
            <div className="flex items-center gap-6">
                <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-primary-teal" />
                <div className="flex items-center gap-3">
                    
                    {/* The image 'src' is now guaranteed to have a valid path */}
                    <img 
                        src={user?.avatar || defaultAvatar} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full object-cover bg-gray-200" 
                    />

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