// src/pages/dashboards/UserProfilePage.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// --- THIS IS THE FIX: We add FaPlus to the import list ---
import { FaPalette, FaHistory, FaRocket, FaEdit, FaUserCircle, FaPlus } from 'react-icons/fa';

const UserProfilePage = () => {
    const { user } = useAuth();
    
    // Dummy data for saved designs
    const savedDesigns = [
        { name: 'Modern Living Room', img: 'https://source.unsplash.com/random/400x300?modern,livingroom' },
        { name: 'Bohemian Bedroom', img: 'https://source.unsplash.com/random/400x300?bohemian,bedroom' },
        { name: 'Minimalist Office', img: 'https://source.unsplash.com/random/400x300?minimalist,office' },
    ];

    return (
        <div>
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center gap-4">
                    <img src={user?.avatar || 'https://source.unsplash.com/150x150/?portrait'} alt="User Avatar" className="w-20 h-20 rounded-full border-4 border-primary-teal" />
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-dark">Welcome, {user?.name || 'User'}!</h2>
                        <p className="text-gray-600 capitalize">{user?.role} User</p>
                    </div>
                    <button className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 self-start">
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>

            {/* Upgrade Banner for Registered Users */}
            {user?.role === 'registered' && (
                <div className="bg-accent-gold text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg">
                    <div>
                        <h3 className="font-bold text-lg">Unlock Your Full Design Potential!</h3>
                        <p>Upgrade to Premium for AR Preview, unlimited designs, and more.</p>
                    </div>
                    <Link to="/upgrade" className="bg-white text-accent-gold px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
                        <FaRocket /> Upgrade Now
                    </Link>
                </div>
            )}
            
            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">My Saved Designs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {savedDesigns.map(design => (
                            <div key={design.name} className="border rounded-lg overflow-hidden group cursor-pointer">
                                <img src={design.img} alt={design.name} className="w-full h-32 object-cover" />
                                <p className="p-3 text-sm font-semibold group-hover:text-primary-teal">{design.name}</p>
                            </div>
                        ))}
                         <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">
                            <FaPlus />
                            <span className="text-sm mt-1">New Design</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <ul className="space-y-4">
                        <li><Link to="/visualizer" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaPalette /> Start a New Design</Link></li>
                        <li><Link to="/history" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaHistory /> View Consultation History</Link></li>
                        <li><Link to="/account" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaUserCircle /> Manage Account</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;