// src/pages/dashboards/DesignerDashboardPage.jsx
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaDollarSign, FaClock, FaStar, FaPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

// --- THIS IS THE FIX: We now import the reusable component ---
import StatCard from '../../components/dashboard/StatCard';

const DesignerDashboardPage = () => {
    // --- DUMMY DATA ---
    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Monthly Earnings ($)', data: [150, 250, 180, 300, 280, 400], borderColor: '#0D9488', tension: 0.1 }]
    };
    const consultationRequests = [
        { name: 'Himna', date: '08 Jan, 2024', status: 'Pending' },
        { name: 'Jeya', date: '05 Jan, 2024', status: 'Completed' },
    ];

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Earnings" value="$1,560" icon={<FaDollarSign className="text-white" />} color="bg-green-400" />
                <StatCard title="Upcoming Consultations" value="3" icon={<FaClock className="text-white" />} color="bg-blue-400" />
                <StatCard title="Average Rating" value="4.8" icon={<FaStar className="text-white" />} color="bg-yellow-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Earnings Analytics</h3>
                    <Line data={earningsData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Consultation Requests</h3>
                    <ul>
                        {consultationRequests.map(item => (
                            <li key={item.name} className="flex justify-between items-center py-2 border-b">
                                <div><p>{item.name}</p><p className="text-xs text-gray-500">{item.date}</p></div>
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{item.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DesignerDashboardPage;