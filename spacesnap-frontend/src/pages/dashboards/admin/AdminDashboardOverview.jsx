// src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaUserTie, FaPalette, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-neutral-dark">{value}</p>
        </div>
    </div>
);

// The Main Dashboard Component
const AdminDashboardOverview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalDesigners: 0, pendingApprovals: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // We assume this endpoint is protected and only accessible by admins
                const res = await axios.get('http://localhost:5000/api/users');
                const users = res.data;

                const totalUsers = users.length;
                const totalDesigners = users.filter(u => u.role === 'designer').length;
                // Pending approvals are users with the 'registered' role for now
                const pendingApprovals = users.filter(u => u.role === 'registered').length;
                const recent = users.slice(-5).reverse();

                setStats({ totalUsers, totalDesigners, pendingApprovals });
                setRecentUsers(recent);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const roleDistributionData = {
        labels: ['Registered/Premium', 'Designers', 'Admins'],
        datasets: [{
            data: [
                stats.totalUsers - stats.totalDesigners - 1, // Subtract the one admin
                stats.totalDesigners, 
                1
            ],
            backgroundColor: ['#3B82F6', '#10B981', '#EF4444'], // blue, green, red
            borderColor: '#ffffff',
            borderWidth: 4,
        }]
    };
    
    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'New Users',
            data: [12, 19, 3, 5, 2, 3], // Dummy data for the chart
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderRadius: 4,
        }]
    };

    if (loading) return <div className="text-center p-10">Loading Dashboard Data...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Admin Overview</h1>

            {/* --- STATISTIC CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers className="text-white text-2xl" />} color="bg-blue-500" />
                <StatCard title="Active Designers" value={stats.totalDesigners} icon={<FaUserTie className="text-white text-2xl" />} color="bg-green-500" />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<FaCheckCircle className="text-white text-2xl" />} color="bg-yellow-500" />
            </div>

            {/* --- CHARTS & RECENT ACTIVITY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* --- Left Column (Main Chart) --- */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4 text-neutral-dark">User Registration Growth</h3>
                    <div className="h-80">
                        <Bar data={userGrowthData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                {/* --- Right Column (Doughnut Chart & Recent Activity) --- */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-neutral-dark">User Role Distribution</h3>
                        <div className="h-56 flex justify-center">
                            <Doughnut data={roleDistributionData} options={{ maintainAspectRatio: false, cutout: '60%' }}/>
                        </div>
                    </div>
                    
                    {/* --- NEW RECENT ACTIVITY SECTION --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-neutral-dark">Recent Activity</h3>
                        <ul className="space-y-4">
                            {/* This is dynamic now, showing the last 5 users who joined */}
                            {recentUsers.map(user => (
                                <li key={user._id} className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <FaUserPlus className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{user.name} has registered.</p>
                                        <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                            {/* Example of a different type of activity */}
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <FaPalette className="text-green-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">A new design was created.</p>
                                    <p className="text-xs text-gray-500">1 hour ago</p>
                                </div>
                            </li>
                        </ul>
                        <Link to="/admin/users" className="text-sm font-semibold text-primary-teal hover:underline mt-4 block text-right">View All Users</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;