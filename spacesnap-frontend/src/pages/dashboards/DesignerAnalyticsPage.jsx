// src/pages/dashboards/DesignerAnalyticsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Loader2, Clock, MessageSquare, CheckCircle, Briefcase } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
        {icon}
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

const DesignerAnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/consultations/designer/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    if (loading || !stats) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    const chartData = {
        labels: ['Pending', 'Active', 'Completed'],
        datasets: [{
            label: 'Consultations',
            data: [stats.pending, stats.active, stats.completed],
            backgroundColor: ['#FBBF24', '#3B82F6', '#10B981'],
            borderRadius: 5,
        }]
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Analytics</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Pending Requests" value={stats.pending} icon={<Clock size={32} className="text-yellow-500" />} />
                <StatCard title="Active Consultations" value={stats.active} icon={<MessageSquare size={32} className="text-blue-500" />} />
                <StatCard title="Completed Jobs" value={stats.completed} icon={<CheckCircle size={32} className="text-green-500" />} />
                <StatCard title="Total Content" value={stats.totalContent} icon={<Briefcase size={32} className="text-indigo-500" />} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="font-bold text-xl text-gray-800 mb-4">Consultation Overview</h3>
                <div style={{ height: '300px' }}>
                     <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
            </div>
        </div>
    );
};

export default DesignerAnalyticsPage;