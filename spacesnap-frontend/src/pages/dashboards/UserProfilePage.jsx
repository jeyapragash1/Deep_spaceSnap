// src/pages/dashboards/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPalette, FaRocket, FaEdit, FaComments, FaCrown, FaThLarge, FaQuestionCircle, FaFileContract } from 'react-icons/fa';
import ConsultationModal from '../../components/dashboard/ConsultationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// --- Reusable Stat Card Component for this page ---
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
        <div className="text-primary-teal text-3xl mb-2">{icon}</div>
        <p className="text-3xl font-bold text-neutral-dark">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
);

const UserProfilePage = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // --- NEW STATE FOR FETCHED DATA ---
    const [stats, setStats] = useState({ designs: 0, quizzes: 0, consultations: 0 });
    const [recentDesigns, setRecentDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data in parallel for better performance
                const [designsRes, consultationsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/designs/mydesigns'),
                    axios.get('http://localhost:5000/api/consultations/myconsultations')
                ]);
                
                setStats({
                    designs: designsRes.data.length,
                    consultations: consultationsRes.data.length,
                    quizzes: 1 // Dummy data for now
                });
                // Get the 3 most recent designs to display
                setRecentDesigns(designsRes.data.slice(0, 3));

            } catch (err) {
                console.error("Failed to fetch user dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div>
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* --- HEADER --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center gap-6">
                <img src={user?.avatar} alt="User Avatar" className="w-20 h-20 rounded-full border-4 border-primary-teal" />
                <div>
                    <h2 className="text-3xl font-bold text-neutral-dark">Welcome, {user?.name}!</h2>
                    <div className="mt-1">
                        {user?.role === 'premium' ? (
                            <span className="flex items-center gap-1 text-sm bg-yellow-400 text-yellow-900 font-semibold px-3 py-1 rounded-full"><FaCrown /> Premium Member</span>
                        ) : (
                            <span className="text-sm bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full">Registered User</span>
                        )}
                    </div>
                </div>
            </div>

            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Saved Designs" value={stats.designs} icon={<FaThLarge />} />
                <StatCard title="Quizzes Taken" value={stats.quizzes} icon={<FaQuestionCircle />} />
                <StatCard title="Consultations" value={stats.consultations} icon={<FaFileContract />} />
            </div>

            {/* --- UPGRADE BANNER (for registered users) --- */}
            {user?.role === 'registered' && (
                <div className="bg-orange-400 text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg">
                    <div><h3 className="font-bold text-lg">Unlock Your Full Design Potential!</h3><p>Upgrade to Premium for full AR Preview access, unlimited designs, and more.</p></div>
                    <Link to="/upgrade" className="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"><FaRocket /> Upgrade Now</Link>
                </div>
            )}
            
            {/* --- CONTENT SECTIONS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">My Recent Designs</h3>
                    {recentDesigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentDesigns.map(design => (
                                <div key={design._id} className="border rounded-lg overflow-hidden group cursor-pointer">
                                    <img src={design.thumbnail} alt={design.name} className="w-full h-32 object-cover" />
                                    <p className="p-3 text-sm font-semibold group-hover:text-primary-teal">{design.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">You haven't saved any designs yet.</p>
                            <Link to="/visualizer" className="bg-primary-teal text-white font-bold py-2 px-4 rounded-lg">Start Designing</Link>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <ul className="space-y-4 flex-grow">
                        <li><Link to="/style-quiz" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaPalette /> Take the Style Quiz</Link></li>
                        <li><Link to="/account" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaEdit /> Manage Account</Link></li>
                    </ul>
                    <div className="mt-auto pt-4 border-t">
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-primary-teal text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90">
                            <FaComments /> Book a Designer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserProfilePage;