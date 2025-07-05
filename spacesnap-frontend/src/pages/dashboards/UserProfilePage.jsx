// src/pages/dashboards/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPalette, FaHistory, FaRocket, FaEdit, FaUserCircle, FaPlus, FaComments, FaCrown, FaWarehouse, FaQuestionCircle } from 'react-icons/fa';
import ConsultationModal from '../../components/dashboard/ConsultationModal';
import PaymentModal from '../../components/ui/PaymentModal';

// --- THIS IS THE FIX: We import the reusable Button component ---
import Button from '../../components/common/Button';


// --- Reusable Stat Card ---
const StatCard = ({ title, value, icon, link }) => (
    <Link to={link || '#'} className="bg-white p-6 rounded-lg shadow-md flex items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="bg-teal-100 p-3 rounded-full mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-neutral-dark">{value}</p>
        </div>
    </Link>
);

const UserProfilePage = () => {
    const { user, updateUserToken } = useAuth();
    const navigate = useNavigate();
    
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        designs: [],
        quizResults: [],
        consultations: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/profile/my-data');
                setDashboardData(res.data);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConfirmUpgrade = async () => {
        setLoading(true);
        try {
            const res = await axios.put('http://localhost:5000/api/users/upgrade-to-premium', {});
            updateUserToken(res.data.token);
            alert('Upgrade successful!');
            setIsUpgradeModalOpen(false);
        } catch (err) {
            alert('Upgrade failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div>
            <ConsultationModal isOpen={isConsultationModalOpen} onClose={() => setIsConsultationModalOpen(false)} />
            <PaymentModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onConfirm={handleConfirmUpgrade} title="Upgrade to Premium" description="Unlock all features including AR Preview." amount={1000} isLoading={loading} />

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center gap-6"><img src={user?.avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-primary-teal object-cover" /><div><h2 className="text-3xl font-bold text-neutral-dark">Welcome, {user?.name}!</h2><span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${user?.role === 'premium' ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-800'}`}>{user?.role === 'premium' && <FaCrown className="inline mr-1" />}{user?.role} User</span></div></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Saved Designs" value={dashboardData.designs.length} icon={<FaWarehouse className="text-teal-600" />} link="/user/designs" />
                <StatCard title="Quizzes Taken" value={dashboardData.quizResults.length} icon={<FaQuestionCircle className="text-teal-600" />} link="/user/quiz-history" />
                <StatCard title="Consultations" value={dashboardData.consultations.length} icon={<FaComments className="text-teal-600" />} link="/user/consultations" />
            </div>

            {user?.role === 'registered' && (
                <div className="bg-accent-gold text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg">
                    <div><h3 className="font-bold text-lg">Unlock Your Full Design Potential!</h3><p>Upgrade to Premium for full AR Preview access, unlimited designs, and more.</p></div>
                    <button onClick={() => setIsUpgradeModalOpen(true)} className="bg-white text-accent-gold px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transform hover:scale-105"><FaRocket /> Upgrade Now</button>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">My Recent Designs</h3>
                    {dashboardData.designs.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">{dashboardData.designs.slice(0, 3).map(design => (<div key={design._id} className="border rounded-lg overflow-hidden group cursor-pointer"><img src={design.thumbnail} alt={design.name} className="w-full h-32 object-cover" /><p className="p-3 text-sm font-semibold group-hover:text-primary-teal">{design.name}</p></div>))}</div>) : (<div className="text-center py-8"><p className="text-gray-500">You haven't saved any designs yet.</p><Button onClick={() => navigate('/visualizer')} className="mt-4">Start Designing</Button></div>)}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <ul className="space-y-4 flex-grow">
                        <li><Link to="/style-quiz" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaPalette /> Take the Style Quiz</Link></li>
                        <li><Link to="/user/account" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaUserCircle /> Manage Account</Link></li>
                        <li><Link to="/user/consultations" className="flex items-center gap-3 text-lg text-gray-700 hover:text-primary-teal"><FaHistory /> View Consultations</Link></li>
                    </ul>
                    <div className="mt-auto pt-4 border-t"><button onClick={() => setIsConsultationModalOpen(true)} className="w-full bg-primary-teal text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90"><FaComments /> Book a Designer</button></div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;