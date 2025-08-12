// src/pages/dashboards/admin/AdminDashboardOverview.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig'; // Assuming your axios instance is here
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaUserTie, FaCheckCircle, FaUserPlus, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Register all necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ===================================================================
// --- Reusable Sub-Components (Now with defensive checks) ---
// ===================================================================

const StatCard = ({ title, value, icon, bgColor, iconColor, linkTo }) => (
    <Link to={linkTo} className="block bg-white p-6 rounded-xl shadow border flex items-center transform hover:-translate-y-1 transition-all duration-300">
        <div className={`p-4 rounded-lg mr-4 ${bgColor}`}>
            <div className={`text-2xl ${iconColor}`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            {/* Show a placeholder while loading */}
            <p className="text-3xl font-bold text-gray-800">{value === undefined ? '...' : value}</p>
        </div>
    </Link>
);

const RoleDistributionChart = ({ stats }) => {
    // --- FIX 1: Check if stats exist before trying to create the chart ---
    if (!stats) {
        // You can return a loading skeleton or null
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border h-72 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-48 w-48 mx-auto bg-gray-200 rounded-full"></div>
            </div>
        );
    }
    
    // This code only runs if `stats` is a valid object
    const adminCount = stats.totalUsers - stats.totalDesigners - stats.pendingApprovals;
    
    const data = {
        labels: ['Registered Users', 'Designers', 'Admins'],
        datasets: [{
            data: [stats.pendingApprovals, stats.totalDesigners, adminCount > 0 ? adminCount : 0],
            backgroundColor: ['#FBBF24', '#10B981', '#EF4444'], // yellow, green, red
            borderColor: '#ffffff',
            borderWidth: 4,
        }]
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">User Role Distribution</h3>
            <div className="h-56 flex justify-center"><Doughnut data={data} options={{ maintainAspectRatio: false, cutout: '70%' }}/></div>
        </div>
    );
};

const RecentUsersList = ({ users }) => {
    // --- FIX 2: Check if the 'users' prop is a valid array ---
    // If it's undefined (during loading) or not an array, it won't crash.
    if (!Array.isArray(users)) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Recently Joined Users</h3>
            <ul className="space-y-4">
                {users.length > 0 ? users.map(user => (
                    <li key={user._id} className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full"><FaUserPlus className="text-blue-500" /></div>
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </li>
                )) : <p className="text-sm text-gray-500">No recent user activity.</p>}
            </ul>
            <Link to="/admin/users" className="text-sm font-semibold text-blue-600 hover:underline mt-6 block text-right">View All Users →</Link>
        </div>
    );
};

// ===================================================================
// --- Main Dashboard Page Component ---
// ===================================================================
const AdminDashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError('Could not load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- FIX 3: Keep the loading check for the overall page ---
    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }
    
    // Fallback if API returns no data for some reason
    if (!stats) {
         return <div className="text-center text-gray-500 p-8">Could not retrieve dashboard statistics.</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>

            {/* --- STATISTIC CARDS (now safe from undefined values) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} linkTo="/admin/users" icon={<FaUsers />} bgColor="bg-blue-100" iconColor="text-blue-600" />
                <StatCard title="Active Designers" value={stats.totalDesigners} linkTo="/admin/users" icon={<FaUserTie />} bgColor="bg-green-100" iconColor="text-green-600" />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} linkTo="/admin/approvals" icon={<FaCheckCircle />} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
                <StatCard title="Total Content" value={stats.totalDesigns} linkTo="/admin/content" icon={<FaPalette />} bgColor="bg-indigo-100" iconColor="text-indigo-600" />
            </div>

            {/* --- CHARTS & RECENT ACTIVITY (now safe from undefined values) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <RoleDistributionChart stats={stats} />
                </div>
                <div className="lg:col-span-1">
                    {/* Pass the recentUsers array specifically, which might be undefined */}
                    <RecentUsersList users={stats.recentUsers} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;