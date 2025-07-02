// src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React from 'react';
import { FaUsers, FaPalette, FaDollarSign, FaBriefcase } from 'react-icons/fa';
import StatCard from '../../../components/dashboard/StatCard'; // Assuming this component exists

const AdminDashboardOverview = () => {
    // We will use simple dummy data for now
    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Users" value="1,257" icon={<FaUsers />} color="bg-blue-500" />
                <StatCard title="Total Designers" value="53" icon={<FaBriefcase />} color="bg-green-500" />
                <StatCard title="Designs Created" value="8,940" icon={<FaPalette />} color="bg-yellow-500" />
                <StatCard title="Total Revenue" value="$4,580" icon={<FaDollarSign />} color="bg-red-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-semibold text-lg">More analytics and charts will go here.</h2>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;