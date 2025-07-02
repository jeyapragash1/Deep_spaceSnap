// src/pages/dashboards/DesignerDashboardPage.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FaDollarSign, FaFileInvoice, FaRegThumbsUp } from 'react-icons/fa';

// --- THIS IS THE FIX: The path now correctly points to the component ---
import DesignerStatCard from '../../components/dashboard/DesignerStatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- DUMMY DATA (to match your image) ---
const salesAnalyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [{
        label: 'Sales',
        data: [28, 40, 36, 52, 48, 60, 54, 68, 62],
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
    }]
};

const bestSellers = [
    { name: 'Modern Living Room Package', sales: 260 },
    { name: 'Bohemian Bedroom Concept', sales: 1474 },
    { name: 'Minimalist Office Design', sales: 8784 },
];

const recentTransactions = [
    { name: 'Andrea Witler', method: 'Apple Pay', status: 'Success', amount: 1099.00 },
    { name: 'Timothy Sands', method: 'Stripe', status: 'Pending', amount: 200.10 },
    { name: 'Bonnie Rodrigues', method: 'PayU', status: 'Success', amount: 1569.00 },
];

const DesignerDashboardPage = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <DesignerStatCard title="Weekly Earning" value="$95,000.45" change="+48%" icon={<div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center"><FaDollarSign className="text-green-600" /></div>} />
                <DesignerStatCard title="10,000+" value="Total Sales" color="bg-orange-400 text-white" />
                <DesignerStatCard title="800+" value="Purchased Goods" color="bg-blue-900 text-white" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Best Seller</h3>
                    <ul className="space-y-4">
                        {bestSellers.map(p => <li key={p.name} className="flex items-center justify-between"><p className="font-medium">{p.name}</p><span className="text-sm text-gray-500">{p.sales}</span></li>)}
                    </ul>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
                    <table className="w-full">
                        <tbody>
                           {recentTransactions.map(t=><tr key={t.name} className="border-b"><td className="py-2">{t.name}</td><td>{t.method}</td><td><span className={`text-xs px-2 py-1 rounded-full ${t.status==='Success'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>{t.status}</span></td><td className="text-right font-semibold">${t.amount.toFixed(2)}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4">Sales Analytics</h3>
                <div className="h-64"><Line data={salesAnalyticsData} options={{ maintainAspectRatio: false }} /></div>
            </div>
        </div>
    );
};

export default DesignerDashboardPage;