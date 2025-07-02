// src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaPalette, FaDollarSign, FaBriefcase } from 'react-icons/fa';
import StatCard from '../../../components/dashboard/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboardOverview = () => {
    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'New Users', data: [65, 59, 80, 81, 56, 55], backgroundColor: 'rgba(13, 148, 136, 0.6)' }]
    };
    const roleDistributionData = {
        labels: ['Registered', 'Premium', 'Designer'],
        datasets: [{ data: [300, 150, 50], backgroundColor: ['#34D399', '#F59E0B', '#60A5FA'] }]
    };
    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Users" value="1,257" icon={<FaUsers className="text-white" />} color="bg-blue-400" />
                <StatCard title="Total Designers" value="53" icon={<FaBriefcase className="text-white" />} color="bg-green-400" />
                <StatCard title="Designs Created" value="8,940" icon={<FaPalette className="text-white" />} color="bg-yellow-400" />
                <StatCard title="Total Revenue" value="$4,580" icon={<FaDollarSign className="text-white" />} color="bg-red-400" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">User Growth</h3>
                    <Bar data={userGrowthData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">User Roles</h3>
                    <Doughnut data={roleDistributionData} />
                </div>
            </div>
        </div>
    );
};
export default AdminDashboardOverview;