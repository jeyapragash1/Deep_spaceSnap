// src/pages/dashboards/UserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Loader2, MessageSquare, Edit, ThumbsUp, Sparkles, Crown, Lock } from 'lucide-react';

// --- Reusable card component ---
const DashboardCard = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md border ${className}`}>
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// --- ConsultationStatus sub-component ---
const ConsultationStatus = ({ consultation }) => {
    const designerName = consultation?.designer?.name || 'an Unknown Designer';
    const formattedDate = new Date(consultation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return (
        <Link to={`/user/consultations/${consultation._id}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-700">{consultation.subject}</p>
                    <p className="text-sm text-gray-500">With {designerName} on {formattedDate}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${ consultation.status === 'Completed' ? 'bg-green-100 text-green-700' : consultation.status === 'Accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {consultation.status}
                </span>
            </div>
        </Link>
    );
};

// --- A new component for the quick action links ---
const QuickActionButton = ({ to, isLocked, icon, color, text }) => {
    const navigate = useNavigate();
    const IconComponent = icon;
    const colorClasses = {
        blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600', text: 'text-blue-800' },
        purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'text-purple-600', text: 'text-purple-800' },
    };
    const colors = colorClasses[color] || colorClasses.blue;

    const handleClick = (e) => {
        if (isLocked) {
            e.preventDefault(); // Prevent the default link behavior
            navigate('/upgrade'); // Redirect to the upgrade page
        }
    };

    return (
        <Link to={to} onClick={handleClick} className={`relative block p-4 ${colors.bg} ${colors.hover} rounded-lg text-center transition-colors`}>
            {isLocked && (
                <div className="absolute top-2 right-2 bg-yellow-400 p-1 rounded-full">
                    <Lock size={12} className="text-yellow-800" />
                </div>
            )}
            <IconComponent className={`mx-auto ${colors.icon} mb-2`} size={28} />
            <p className={`font-bold ${colors.text}`}>{text}</p>
        </Link>
    );
};


// --- The Main User Profile Page Component ---
const UserProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // <-- Add useNavigate
    const [stats, setStats] = useState(null); // <-- FIX: Added '='
    const [recentDesigns, setRecentDesigns] = useState([]);
    const [upcomingConsultation, setUpcomingConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isPremium = user?.subscription === 'premium' || user?.role === 'designer' || user?.role === 'admin';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [designsRes, consultationsRes] = await Promise.all([
                    api.get('/designs/mydesigns'),
                    api.get('/consultations/my-consultations'),
                ]);
                
                setRecentDesigns(designsRes.data.slice(0, 3));
                const upcoming = consultationsRes.data.find(c => c.status !== 'Completed');
                setUpcomingConsultation(upcoming);
                setStats({ designs: designsRes.data.length, consultations: consultationsRes.data.length });
            } catch (err) {
                console.error("Failed to fetch user dashboard data:", err);
                setError("Could not load your dashboard. Please try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };
        if (user) { fetchDashboardData(); }
    }, [user]);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Welcome Banner */}
            <div className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-4">
                <img src={user?.avatar || '/default-avatar.png'} alt="User Avatar" className="w-16 h-16 rounded-full" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h2>
                    {isPremium ? (
                        <span className="flex items-center gap-1.5 text-sm bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full mt-1 w-fit">
                            <Crown size={14} /> Premium Member
                        </span>
                    ) : (
                        <span className="text-sm bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full mt-1">
                            Registered User
                        </span>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <DashboardCard title="Start Creating">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickActionButton to="/visualizer" isLocked={!isPremium} icon={Sparkles} color="blue" text="AI Room Visualizer" />
                            <QuickActionButton to="/ar-preview" isLocked={!isPremium} icon={ThumbsUp} color="purple" text="Scan & Reimagine AR" />
                        </div>
                        {!isPremium && (
                            <div className="mt-4 text-center p-3 bg-yellow-50 border-l-4 border-yellow-400">
                                <p className="text-sm text-yellow-800">
                                    <Link to="/upgrade" className="font-bold underline">Upgrade to Premium</Link> to unlock AI features and book consultations!
                                </p>
                            </div>
                        )}
                    </DashboardCard>
                    
                    {/* Recent Designs */}
                    <DashboardCard title="My Recent Designs">
                        {recentDesigns.length > 0 ? (
                            <div className="space-y-2">
                                {recentDesigns.map(design => (
                                    <Link key={design._id} to={`/visualizer/${design._id}`} className="block p-3 rounded-lg hover:bg-gray-50">
                                        <p className="font-semibold text-gray-700">{design.name}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">You haven't saved any designs yet.</p>
                        )}
                    </DashboardCard>
                </div>

                <div className="space-y-6">
                    {/* Consultation Status */}
                    <DashboardCard title="Consultation Status">
                        {upcomingConsultation ? (
                            <ConsultationStatus consultation={upcomingConsultation} />
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-500 mb-4">You have no active consultations.</p>
                                {/* --- THIS IS THE ONLY PART THAT HAS BEEN CHANGED --- */}
                                {isPremium ? (
                                    <Link to="/user/designers" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                                        Book a Designer
                                    </Link>
                                ) : (
                                    <Link to="/upgrade" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                                        Book a Designer
                                    </Link>
                                )}
                                {/* --- END OF CHANGE --- */}
                            </div>
                        )}
                    </DashboardCard>
                    
                    {/* Account Actions */}
                    <DashboardCard title="My Account">
                         <div className="space-y-3">
                            <Link to="/upgrade" className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><MessageSquare size={18}/> View All Consultations</Link>
                            <Link to="/user/account" className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><Edit size={18}/> Manage Account</Link>
                         </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;