// spacesnap-frontend/src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaPalette, FaDollarSign, FaBriefcase } from 'react-icons/fa';
import StatCard from '../../../components/dashboard/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboardOverview = () => {
    const userGrowthData = { /* ...dummy data... */ };
    const roleDistributionData = { /* ...dummy data... */ };

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Users" value="1,257" icon={<FaUsers />} color="bg-blue-500" />
                <StatCard title="Total Designers" value="53" icon={<FaBriefcase />} color="bg-green-500" />
                <StatCard title="Designs Created" value="8,940" icon={<FaPalette />} color="bg-yellow-500" />
                <StatCard title="Total Revenue" value="$4,580" icon={<FaDollarSign />} color="bg-red-500" />
            </div>
            {/* ... rest of your chart components ... */}
        </div>
    );
};

export default AdminDashboardOverview;