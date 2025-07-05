// src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaUserTie, FaCheckCircle, FaUserPlus, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- Register all necessary Chart.js components ---
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


// ===================================================================
// --- 1. Reusable Sub-Components for a Cleaner Structure ---
// ===================================================================

// A more visually appealing Stat Card
const StatCard = ({ title, value, icon, bgColor, iconColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center transform hover:-translate-y-1 transition-all duration-300">
        <div className={`p-4 rounded-lg mr-4 ${bgColor}`}>
            <div className={`text-2xl ${iconColor}`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-neutral-dark">{value}</p>
        </div>
    </div>
);

// A dedicated component for the User Growth Chart
const UserGrowthChart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'New Users',
            data: [12, 19, 8, 15, 12, 17], // Slightly more realistic dummy data
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderColor: 'rgba(13, 148, 136, 1)',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full">
            <h3 className="font-semibold text-lg mb-4 text-neutral-dark">User Registration Growth</h3>
            <div className="h-80"><Bar data={data} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
    );
};

// A dedicated component for the Role Distribution Chart
const RoleDistributionChart = ({ stats }) => {
    const data = {
        labels: ['Registered Users', 'Designers', 'Admins'],
        datasets: [{
            data: [stats.totalUsers - stats.totalDesigners - stats.totalAdmins, stats.totalDesigners, stats.totalAdmins],
            backgroundColor: ['#3B82F6', '#10B981', '#EF4444'], // blue, green, red
            borderColor: '#ffffff',
            borderWidth: 4,
        }]
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-4 text-neutral-dark">User Role Distribution</h3>
            <div className="h-56 flex justify-center"><Doughnut data={data} options={{ maintainAspectRatio: false, cutout: '70%' }}/></div>
        </div>
    );
};

// A dedicated component for the Recent Activity Feed
const RecentActivityFeed = ({ users }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-4 text-neutral-dark">Recent Activity</h3>
        <ul className="space-y-4">
            {users.map(user => (
                <li key={user._id} className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full"><FaUserPlus className="text-blue-500" /></div>
                    <div>
                        <p className="font-semibold text-sm">{user.name} has registered.</p>
                        <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                </li>
            ))}
            <li className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-full"><FaPalette className="text-green-500" /></div>
                <div>
                    <p className="font-semibold text-sm">A new design template was uploaded.</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
            </li>
        </ul>
        <Link to="/admin/users" className="text-sm font-semibold text-primary-teal hover:underline mt-6 block text-right">View All Users →</Link>
    </div>
);


// ===================================================================
// --- 2. The Main Dashboard Page Component (The "Container") ---
// ===================================================================
const AdminDashboardOverview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalDesigners: 0, totalAdmins: 0, pendingApprovals: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users');
                const users = res.data;

                setStats({
                    totalUsers: users.length,
                    totalDesigners: users.filter(u => u.role === 'designer').length,
                    totalAdmins: users.filter(u => u.role === 'admin').length,
                    pendingApprovals: users.filter(u => u.role === 'registered').length, // Assuming all registered are pending
                });
                setRecentUsers(users.slice(-3).reverse()); // Get the last 3 registered users
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><p>Loading Dashboard...</p></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Admin Overview</h1>

            {/* --- STATISTIC CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} bgColor="bg-blue-100" iconColor="text-blue-600" />
                <StatCard title="Active Designers" value={stats.totalDesigners} icon={<FaUserTie />} bgColor="bg-green-100" iconColor="text-green-600" />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<FaCheckCircle />} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
            </div>

            {/* --- CHARTS & RECENT ACTIVITY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <UserGrowthChart />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <RoleDistributionChart stats={stats} />
                    <RecentActivityFeed users={recentUsers} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;