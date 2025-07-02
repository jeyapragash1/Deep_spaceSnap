// src/pages/dashboards/admin/AdminDashboardOverview.jsx
import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { FaUsers, FaPalette, FaDollarSign, FaUserCheck, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';
import StatCard from '../../../components/dashboard/StatCard';

// Register all necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

// --- DUMMY DATA (to match your image) ---
const salesAndPurchaseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Total Sales', data: [38, 49, 40, 25, 42, 49, 35, 41, 28, 48, 40, 32], backgroundColor: 'rgba(13, 148, 136, 0.8)', borderRadius: 4, },
               { label: 'Total Purchase', data: [22, 31, 28, 18, 30, 35, 25, 29, 20, 32, 28, 24], backgroundColor: 'rgba(245, 158, 11, 0.8)', borderRadius: 4, }]
};
const salesAnalyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Revenue', data: [15, 22, -18, 10, 25, -5, 18, -10, 28, 12, -20, 30], backgroundColor: (context) => context.raw >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',},
               { label: 'Expense', data: [-12, -18, 12, -8, -20, 8, -15, 12, -22, -10, 15, -25], backgroundColor: (context) => context.raw >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',}]
};
const categoryData = {
    labels: ['Electronics', 'Lifestyles'],
    datasets: [{ data: [698, 456], backgroundColor: ['#3B82F6', '#10B981'], borderWidth: 0, }]
};

const topSellingProducts = [
    { name: 'Charger Cable - Lighting', sales: '280+ Sales' },
    { name: 'Yves Saint Eau De Parfum', sales: '145+ Sales' },
    { name: 'Apple Airpods 2', sales: '210+ Sales' },
];

const recentTransactions = [
    { customer: 'Andrea Witler', status: 'Approved', amount: 4560 },
    { customer: 'Timothy Sands', status: 'Approved', amount: 3569 },
    { customer: 'Bonnie Rodrigues', status: 'Pending', amount: 2659 },
    { customer: 'Randy McRae', status: 'Approved', amount: 2155 },
];


const AdminDashboardPage = () => {
    return (
        <div>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Sales" value="$48,988,078" icon={<FaArrowUp />} change="+32%" color="bg-green-100" textColor="text-green-800" />
                <StatCard title="Total Sales Return" value="$16,478,145" icon={<FaArrowDown />} change="-12%" color="bg-red-100" textColor="text-red-800" />
                <StatCard title="Total Purchase" value="$24,145,789" icon={<FaArrowUp />} change="+12%" color="bg-green-100" textColor="text-green-800" />
                <StatCard title="Total Purchase Return" value="$18,458,747" icon={<FaArrowDown />} change="-22%" color="bg-red-100" textColor="text-red-800" />
            </div>

            {/* Main Charts */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="font-semibold text-lg mb-4">Sales & Purchase</h3>
                <Bar data={salesAndPurchaseData} options={{ scales: { y: { ticks: { callback: (value) => `${value}K` } } } }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Top Selling & Low Stock */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Top Selling Products</h3>
                    <ul className="space-y-4">
                        {topSellingProducts.map(p => <li key={p.name} className="flex items-center justify-between"><p className="font-medium">{p.name}</p><span className="text-sm text-gray-500">{p.sales}</span></li>)}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Low Stock Products</h3>
                    <p className="text-gray-500">Placeholder for low stock items...</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Recent Sales</h3>
                    <p className="text-gray-500">Placeholder for recent sales list...</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Analytics & Transactions */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg mb-4">Sales Analytics</h3>
                        <Bar data={salesAnalyticsData} options={{ indexAxis: 'y', scales: { x: { ticks: { callback: (value) => `${value}K` } } } }} />
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
                        <ul className="space-y-2">
                           {recentTransactions.map(t=><li key={t.customer} className="flex justify-between items-center py-1"><p>{t.customer}</p><span className={`text-xs px-2 py-1 rounded-full ${t.status==='Approved'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>{t.status}</span><span>${t.amount}</span></li>)}
                        </ul>
                    </div>
                </div>
                {/* Categories */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Top Categories</h3>
                    <Doughnut data={categoryData} options={{cutout: '60%'}}/>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;