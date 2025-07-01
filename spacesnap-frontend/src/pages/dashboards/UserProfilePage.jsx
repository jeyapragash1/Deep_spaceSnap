// src/pages/dashboards/UserProfilePage.jsx
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { FaPalette, FaHistory, FaRocket, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
    const { user } = useAuth();
    // Dummy data for saved designs
    const savedDesigns = [
        { name: 'Modern Living Room', img: 'https://source.unsplash.com/random/400x300?modern,livingroom' },
        { name: 'Bohemian Bedroom', img: 'https://source.unsplash.com/random/400x300?bohemian,bedroom' },
        { name: 'Minimalist Office', img: 'https://source.unsplash.com/random/400x300?minimalist,office' },
    ];

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h2>
                    <p className="text-gray-600">Here's your personal design hub.</p>
                </div>
                <button className="bg-primary-teal text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <FaEdit /> Edit Profile
                </button>
            </div>

            {/* Upgrade Banner for Registered Users */}
            {user?.role === 'registered' && (
                <div className="bg-yellow-300 text-yellow-900 p-4 rounded-lg mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Unlock Full Potential!</h3>
                        <p>Upgrade to Premium for AR Preview, unlimited designs, and more.</p>
                    </div>
                    <Link to="/upgrade" className="bg-yellow-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
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
                            <div key={design.name} className="border rounded-lg overflow-hidden">
                                <img src={design.img} alt={design.name} className="w-full h-32 object-cover" />
                                <p className="p-2 text-sm font-semibold">{design.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <ul className="space-y-3">
                        <li><Link to="/visualizer" className="flex items-center gap-3 text-gray-700 hover:text-primary-teal"><FaPalette /> Start a New Design</Link></li>
                        <li><Link to="/history" className="flex items-center gap-3 text-gray-700 hover:text-primary-teal"><FaHistory /> View Consultation History</Link></li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProfilePage;