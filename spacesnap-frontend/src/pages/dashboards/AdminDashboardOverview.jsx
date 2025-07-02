// src/pages/dashboards/AdminDashboardOverview.jsx
import React from 'react';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout'; // Correct path to layout
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaPalette, FaDollarSign, FaBriefcase } from 'react-icons/fa';
import StatCard from '../../components/dashboard/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboardOverview = () => {
    const userGrowthData = { /* ... Chart data ... */ };
    const roleDistributionData = { /* ... Chart data ... */ };

    return (
        <AdminDashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard title="Total Users" value="1,257" icon={<FaUsers className="text-white" />} color="bg-blue-400" />
                    <StatCard title="Total Designers" value="53" icon={<FaBriefcase className="text-white" />} color="bg-green-400" />
                    <StatCard title="Designs Created" value="8,940" icon={<FaPalette className="text-white" />} color="bg-yellow-400" />
                    <StatCard title="Total Revenue" value="$4,580" icon={<FaDollarSign className="text-white" />} color="bg-red-400" />
                </div>
                {/* ... Rest of your charts and stats content ... */}
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminDashboardOverview;