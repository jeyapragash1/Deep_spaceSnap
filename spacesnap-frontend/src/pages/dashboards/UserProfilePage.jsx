// src/pages/dashboards/UserProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaPalette, FaHistory, FaRocket, FaEdit, FaUserCircle, FaPlus, FaComments, FaCrown } from 'react-icons/fa';
import ConsultationModal from '../../components/dashboard/ConsultationModal';

const UserProfilePage = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Dummy data for saved designs
    const savedDesigns = [
        { name: 'Modern Living Room', img: 'https://source.unsplash.com/random/400x300?modern,livingroom' },
        { name: 'Bohemian Bedroom', img: 'https://source.unsplash.com/random/400x300?bohemian,bedroom' },
        { name: 'Minimalist Office', img: 'https://source.unsplash.com/random/400x300?minimalist,office' },
    ];

    return (
        <div>
            {/* The modal component is here, but invisible until isOpen is true */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* --- NEW HEADER SECTION --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center gap-6">
                    <img 
                        src={user?.avatar || `https://source.unsplash.com/150x150/?portrait,person,${user?.id}`} 
                        alt="User Avatar" 
                        className="w-24 h-24 rounded-full border-4 border-primary-teal object-cover" 
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-dark">Welcome, {user?.name || 'User'}!</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {user?.role === 'premium' ? (
                                <span className="flex items-center gap-1 text-sm bg-yellow-400 text-yellow-900 font-semibold px-3 py-1 rounded-full">
                                    <FaCrown /> Premium Member
                                </span>
                            ) : (
                                <span className="text-sm bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full">
                                    Registered User
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 self-start">
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>

            {/* --- UPGRADE BANNER (Only for 'registered' users) --- */}
            {user?.role === 'registered' && (
                <div className="bg-accent-gold text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg">
                    <div>
                        <h3 className="font-bold text-lg">Unlock Your Full Design Potential!</h3>
                        <p>Upgrade to Premium for full AR Preview access, unlimited designs, and more.</p>
                    </div>
                    <Link to="/upgrade" className="bg-white text-accent-gold px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transform hover:scale-105 transition-transform">
                        <FaRocket /> Upgrade Now
                    </Link>
                </div>
            )}
            
            {/* --- CONTENT SECTIONS --- */}
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
                         <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary-teal hover:border-primary-teal cursor-pointer transition-colors">
                            <FaPlus />
                            <span className="text-sm mt-1">New Design</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <ul className="space-y-4 flex-grow">
                        <li><Link to="/visualizer" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaPalette /> Start a New Design</Link></li>
                        <li><Link to="/account" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaUserCircle /> Manage Account</Link></li>
                        <li><Link to="/history" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaHistory /> View Consultation History</Link></li>
                    </ul>
                    {/* NEW Consultation Button that opens the modal */}
                    <div className="mt-auto pt-4 border-t">
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-primary-teal text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-transform hover:scale-105">
                            <FaComments /> Book a Designer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;