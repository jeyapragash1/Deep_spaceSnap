// // src/pages/dashboards/DesignerDashboardPage.jsx

// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
// import { FaDollarSign, FaComments, FaCheck, FaTimes, FaHourglassHalf } from 'react-icons/fa';
// import axios from 'axios';
// import DesignerStatCard from '../../components/dashboard/DesignerStatCard';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// // --- Dummy Data for Chart (as real sales data isn't tracked yet) ---
// const salesAnalyticsData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [{
//         label: 'Earnings',
//         data: [150, 250, 180, 300, 280, 400],
//         borderColor: '#0D9488', // primary-teal
//         backgroundColor: 'rgba(13, 148, 136, 0.1)',
//         fill: true,
//         tension: 0.4,
//     }]
// };


// const DesignerDashboardPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [consultations, setConsultations] = useState([]);
//     const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });
//     const [loading, setLoading] = useState(true);

//     // --- DATA FETCHING ---
//     useEffect(() => {
//         const fetchDesignerData = async () => {
//             try {
//                 // The auth token is automatically sent by the AuthContext interceptor
//                 const res = await axios.get('http://localhost:5000/api/consultations/designer');
//                 const fetchedConsultations = res.data;
//                 setConsultations(fetchedConsultations);
                
//                 // Calculate stats based on the fetched data
//                 const pendingCount = fetchedConsultations.filter(c => c.status === 'Pending').length;
//                 const completedCount = fetchedConsultations.filter(c => c.status === 'Completed').length;
//                 setStats({
//                     pending: pendingCount,
//                     completed: completedCount,
//                     total: fetchedConsultations.length,
//                 });

//             } catch (err) {
//                 console.error("Failed to fetch designer data:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDesignerData();
//     }, []);
    
//     // --- ACTION HANDLERS ---
//     const handleUpdateStatus = (id, status) => {
//         // In a real app, you would make a PUT request to the backend here.
//         // For now, we just simulate the update on the frontend for a good UX.
//         alert(`Request ${id} has been marked as ${status}.`);
//         setConsultations(consultations.map(c => c._id === id ? { ...c, status: status } : c));
//     };

//     if (loading) {
//         return <div className="text-center p-10">Loading Designer Dashboard...</div>;
//     }

//     return (
//         <div>
//             {/* --- STATS CARDS (Now with real data) --- */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//                 <DesignerStatCard title="Total Consultations" value={stats.total} icon={<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><FaComments className="text-blue-500" /></div>} />
//                 <DesignerStatCard title="Pending Requests" value={stats.pending} icon={<div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center"><FaHourglassHalf className="text-yellow-500" /></div>} />
//                 <DesignerStatCard title="Completed Jobs" value={stats.completed} icon={<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><FaCheck className="text-green-500" /></div>} />
//             </div>

//             {/* --- CONSULTATION MANAGEMENT TABLE --- */}
//             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//                 <h3 className="font-semibold text-lg mb-4">Consultation Requests</h3>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead>
//                             <tr className="bg-gray-50 border-b">
//                                 <th className="p-4 font-semibold">Client</th>
//                                 <th className="p-4 font-semibold">Subject</th>
//                                 <th className="p-4 font-semibold">Status</th>
//                                 <th className="p-4 font-semibold text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {consultations.length > 0 ? (
//                                 consultations.map(consultation => (
//                                     <tr key={consultation._id} className="border-b hover:bg-gray-50">
//                                         <td className="p-4">
//                                             <p className="font-medium">{consultation.user.name}</p>
//                                             <p className="text-xs text-gray-500">{consultation.user.email}</p>
//                                         </td>
//                                         <td className="p-4 text-gray-600">{consultation.subject}</td>
//                                         <td className="p-4">
//                                             <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
//                                                 consultation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                                                 consultation.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                                                 'bg-gray-100 text-gray-800'
//                                             }`}>
//                                                 {consultation.status}
//                                             </span>
//                                         </td>
//                                         <td className="p-4 text-center space-x-2">
//                                             <button onClick={() => alert(consultation.message)} className="text-blue-600 hover:underline text-xs">View Message</button>
//                                             {consultation.status === 'Pending' && (
//                                                 <>
//                                                     <button onClick={() => handleUpdateStatus(consultation._id, 'Accepted')} className="text-green-600 hover:underline text-xs">Accept</button>
//                                                     <button onClick={() => handleUpdateStatus(consultation._id, 'Cancelled')} className="text-red-600 hover:underline text-xs">Decline</button>
//                                                 </>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr><td colSpan="4" className="text-center p-8 text-gray-500">You have no consultation requests at this time.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* --- EARNINGS ANALYTICS (Using dummy data for now) --- */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="font-semibold text-lg mb-4">Earnings Analytics</h3>
//                 <div className="h-64"><Line data={salesAnalyticsData} options={{ maintainAspectRatio: false }} /></div>
//             </div>
//         </div>
//     );
// };

// export default DesignerDashboardPage;


// src/pages/dashboards/DesignerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import { FaDollarSign, FaClock, FaStar, FaUserFriends } from 'react-icons/fa';
import DesignerStatCard from '../../components/dashboard/DesignerStatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DesignerDashboardPage = () => {
    // --- NEW STATE FOR FETCHED DATA ---
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesignerData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/consultations/designer');
                setConsultations(res.data);
            } catch (err) {
                console.error("Failed to fetch designer data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDesignerData();
    }, []);

    // Dummy data for charts
    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Earnings ($)', data: [150, 250, 180, 300, 280, 400], borderColor: '#0D9488', backgroundColor: 'rgba(13, 148, 136, 0.1)', fill: true, tension: 0.3 }]
    };

    if (loading) return <p>Loading designer dashboard...</p>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <DesignerStatCard title="Total Earnings" value="$1,560" icon={<div className="p-3 rounded-full bg-green-200"><FaDollarSign className="text-green-600" /></div>} />
                <DesignerStatCard title="Active Clients" value="5" icon={<div className="p-3 rounded-full bg-blue-200"><FaUserFriends className="text-blue-600" /></div>} />
                <DesignerStatCard title="Pending Consultations" value={consultations.filter(c => c.status === 'Pending').length} icon={<div className="p-3 rounded-full bg-yellow-200"><FaClock className="text-yellow-600" /></div>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Earnings Analytics</h3>
                    <div className="h-72"><Line data={earningsData} options={{ maintainAspectRatio: false }} /></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Recent Consultation Requests</h3>
                    <ul className="space-y-3">
                        {consultations.length > 0 ? (
                            consultations.slice(0, 5).map(item => (
                                <li key={item._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium">{item.user.name}</p>
                                        <p className="text-xs text-gray-500">{item.subject}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{item.status}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No consultation requests yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default DesignerDashboardPage;