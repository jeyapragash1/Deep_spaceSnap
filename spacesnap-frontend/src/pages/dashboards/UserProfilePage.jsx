// src/pages/dashboards/UserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// --- MODIFIED: Use our single configured api instance ---
import api from '../../api/axiosConfig'; 
import { Sparkles, Camera, Palette, FolderKanban, MessageSquare, Crown, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import ConsultationModal from '../../components/dashboard/ConsultationModal';

// Reusable card component for a consistent dashboard look (Unchanged)
const DashboardCard = ({ title, children, className, seeAllLink }) => (
  <div className={`bg-white rounded-xl shadow p-6 border ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {seeAllLink && (
        <Link to={seeAllLink} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
          See All <ArrowRight size={14} />
        </Link>
      )}
    </div>
    {children}
  </div>
);

// Quick action card for the top row (Unchanged)
const ActionCard = ({ to, icon, title, description, colorClass }) => (
    <Link to={to} className={`block p-6 rounded-xl shadow-lg transition-transform hover:scale-105 ${colorClass}`}>
        {icon}
        <h3 className="text-xl font-bold mt-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
    </Link>
);

const UserProfilePage = () => {
    const { user } = useAuth();
    // --- State for the new modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [stats, setStats] = useState({ designs: 0, consultations: 0 });
    const [recentDesigns, setRecentDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return; // Don't fetch if user is not loaded yet

            setLoading(true);
            try {
                // --- MODIFIED: Use the 'api' instance for authenticated requests ---
                const [designsRes, consultationsRes] = await Promise.all([
                    api.get('/designs/mydesigns'),
                    api.get('/consultations/my-consultations')
                ]);
                
                setStats({
                    designs: designsRes.data.length,
                    consultations: consultationsRes.data.length
                });
                setRecentDesigns(designsRes.data.slice(0, 3));

            } catch (err) {
                console.error("Failed to fetch user dashboard data:", err);
                // Handle potential auth errors here if needed, e.g., by logging out
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]); // Re-fetch data if the user object changes

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* --- ADDED: The Consultation Modal is now part of the page --- */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* --- TOP ROW: Quick Actions --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <ActionCard to="/visualizer" icon={<Sparkles size={32} />} title="AI Visualizer" description="Upload a photo to start" colorClass="bg-blue-500 hover:bg-blue-600" />
                <ActionCard to={user?.role === 'premium' ? "/ar-preview" : "/upgrade"} icon={<Camera size={32} />} title="AR Preview" description="See furniture in your room" colorClass="bg-purple-500 hover:bg-purple-600" />
                <ActionCard to="/style-quiz" icon={<Palette size={32} />} title="Find Your Style" description="Take the style quiz" colorClass="bg-green-500 hover:bg-green-600" />
            </div>

            {/* --- UPGRADE BANNER (for registered users) --- */}
            {user?.role === 'registered' && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                        <Crown size={40} />
                        <div>
                            <h3 className="font-bold text-xl">Unlock Your Full Design Potential!</h3>
                            <p className="opacity-90">Upgrade to Premium for full AR access, unlimited designs, and more.</p>
                        </div>
                    </div>
                    <Link to="/upgrade" className="bg-white text-orange-500 px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-gray-100 shrink-0">
                        Upgrade Now
                    </Link>
                </div>
            )}

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Recent Projects Column --- */}
                <DashboardCard title="Recent Designs" className="lg:col-span-2" seeAllLink="/user/designs">
                    {recentDesigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentDesigns.map(design => (
                                <Link to={`/visualizer/${design._id}`} key={design._id} className="border rounded-lg group overflow-hidden hover:shadow-md transition-shadow">
                                    <img src={design.thumbnail || 'https://via.placeholder.com/300x200'} alt={design.name} className="w-full h-32 object-cover" />
                                    <p className="p-3 font-semibold text-gray-700 group-hover:text-blue-600">{design.name}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Link to="/visualizer" className="text-center py-10 block border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                            <PlusCircle className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-gray-500 font-semibold">Start your first design</p>
                            <p className="text-sm text-gray-400">Click here to launch the AI Visualizer</p>
                        </Link>
                    )}
                </DashboardCard>

                {/* --- Stats & Booking Column --- */}
                <div className="space-y-6">
                    <DashboardCard title="Your Stats">
                       <div className="space-y-3">
                           <div className="flex justify-between items-center text-lg">
                               <span className="flex items-center gap-2 text-gray-600"><FolderKanban size={20} /> Saved Designs</span>
                               <span className="font-bold text-gray-800">{stats.designs}</span>
                           </div>
                           <div className="flex justify-between items-center text-lg">
                               <span className="flex items-center gap-2 text-gray-600"><MessageSquare size={20} /> Consultations</span>
                               <span className="font-bold text-gray-800">{stats.consultations}</span>
                           </div>
                       </div>
                    </DashboardCard>
                    
                    <DashboardCard title="Need Expert Help?">
                        <p className="text-gray-600 mb-4">Book a virtual consultation with a professional interior designer.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                            <MessageSquare size={20} /> Book a Designer
                        </button>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;