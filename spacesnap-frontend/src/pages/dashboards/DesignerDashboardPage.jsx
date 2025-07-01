// src/pages/dashboards/DesignerDashboardPage.jsx

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaDollarSign, FaClock, FaStar } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

// --- THIS IS THE COMPLETE AND CORRECT REGISTRATION for Chart.js ---
// We need to import every single piece that the Line chart uses.
import {
  Chart as ChartJS,
  CategoryScale, // for the x-axis
  LinearScale,   // for the y-axis
  PointElement,  // for the data points on the line
  LineElement,   // for the line itself
  Title,         // for the chart title
  Tooltip,       // for the hover tooltips
  Legend,        // for the legend (e.g., 'Monthly Earnings')
  Filler,        // for filling the area under the line
} from 'chart.js';

// Now we register all these components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Registering the Filler plugin
);
// -----------------------------------------------------------------

import StatCard from '../../components/dashboard/StatCard';

const DesignerDashboardPage = () => {
    // --- DUMMY DATA ---
    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ 
            label: 'Monthly Earnings ($)', 
            data: [150, 250, 180, 300, 280, 400], 
            borderColor: '#0D9488', // primary-teal
            backgroundColor: 'rgba(13, 148, 136, 0.1)', // A transparent version of the line color
            fill: true, // This tells the chart to fill the area under the line
            tension: 0.3 // Makes the line slightly curved
        }]
    };
    
    // Chart.js options for customization
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Earnings Over Last 6 Months'
            }
        }
    };
    
    const consultationRequests = [
        { name: 'Himna', date: '08 Jan, 2024', status: 'Pending' },
        { name: 'Jeya', date: '05 Jan, 2024', status: 'Completed' },
        { name: 'Fathima', date: '02 Jan, 2024', status: 'Completed' },
    ];

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Earnings" value="$1,560" icon={<FaDollarSign className="text-white" />} color="bg-green-500" />
                <StatCard title="Upcoming Consultations" value="3" icon={<FaClock className="text-white" />} color="bg-blue-500" />
                <StatCard title="Average Rating" value="4.8" icon={<FaStar className="text-white" />} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Earnings Analytics</h3>
                    {/* Pass the options to the chart component */}
                    <Line options={chartOptions} data={earningsData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Consultation Requests</h3>
                    <ul className="space-y-2">
                        {consultationRequests.map(item => (
                            <li key={item.name} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <div><p className="font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.date}</p></div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{item.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DesignerDashboardPage;