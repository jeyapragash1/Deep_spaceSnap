// src/pages/dashboards/DesignerDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Loader2, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// A UI Card for displaying stats
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
        {icon}
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

// The main dashboard page for designers
const DesignerDashboardPage = () => {
    const [consultations, setConsultations] = useState([]);
    const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    const fetchDesignerData = async () => {
        try {
            const res = await api.get('/consultations/designer');
            const fetchedConsultations = res.data;
            setConsultations(fetchedConsultations);
            
            const pending = fetchedConsultations.filter(c => c.status === 'Pending').length;
            const accepted = fetchedConsultations.filter(c => c.status === 'Accepted').length;
            const completed = fetchedConsultations.filter(c => c.status === 'Completed').length;
            setStats({ pending, accepted, completed });

        } catch (err) {
            console.error("Failed to fetch designer data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch data when component mounts
        fetchDesignerData();
    }, []);
    
    // Handler to update the status of a consultation
    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await api.put(`/consultations/designer/${id}`, { status });
            // Re-fetch all data to ensure stats and list are up-to-date
            fetchDesignerData(); 
        } catch (error) {
            alert('Failed to update status. Please try again.');
            console.error("Status update error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Designer Dashboard</h1>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Pending Requests" value={stats.pending} icon={<Clock size={32} className="text-yellow-500" />} />
                <StatCard title="Active Consultations" value={stats.accepted} icon={<MessageSquare size={32} className="text-blue-500" />} />
                <StatCard title="Completed Jobs" value={stats.completed} icon={<CheckCircle size={32} className="text-green-500" />} />
            </div>

            {/* --- Consultation Management Table --- */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl text-gray-800">Consultation Requests</h3>
                    <Link to="/designer/content" className="text-blue-600 font-semibold text-sm hover:underline">
                        Manage My Content
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Client</th>
                                <th className="p-4 font-semibold text-gray-600">Subject</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultations.length > 0 ? (
                                consultations.map(con => (
                                    <tr key={con._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={con.user.avatar} alt={con.user.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium text-gray-900">{con.user.name}</p>
                                                <p className="text-xs text-gray-500">{con.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700">{con.subject}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                                                con.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                con.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                                                con.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {con.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-3">
                                                 <Link to={`/designer/consultations/${con._id}`} className="text-blue-600 hover:underline text-sm font-semibold">View / Reply</Link>
                                                {con.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(con._id, 'Accepted')} className="text-green-600 hover:underline text-sm font-semibold">Accept</button>
                                                        <button onClick={() => handleUpdateStatus(con._id, 'Cancelled')} className="text-red-600 hover:underline text-sm font-semibold">Decline</button>
                                                    </>
                                                )}
                                                 {con.status === 'Accepted' && (
                                                     <button onClick={() => handleUpdateStatus(con._id, 'Completed')} className="text-green-600 hover:underline text-sm font-semibold">Mark as Completed</button>
                                                 )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-8 text-gray-500">You have no new consultation requests.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DesignerDashboardPage;