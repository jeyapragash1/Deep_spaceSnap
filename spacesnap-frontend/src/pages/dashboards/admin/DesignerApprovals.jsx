// src/pages/dashboards/admin/DesignerApprovals.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DesignerApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingDesigners = async () => {
        try {
            setLoading(true);
            // --- THE FIX: Call the correct admin route ---
            const res = await axios.get('http://localhost:5000/api/admin/pending-designers');
            setPending(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchPendingDesigners(); }, []);

    const handleApprove = async (userId) => {
        if (window.confirm('Approve this designer?')) {
            try {
                // --- THE FIX: Call the correct admin route ---
                await axios.put(`http://localhost:5000/api/admin/approve-designer/${userId}`);
                fetchPendingDesigners(); // Refresh the list
            } catch (err) {
                alert('Failed to approve designer.');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Pending Designer Approvals</h1>
            {loading ? <p>Loading...</p> : 
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Applied On</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {pending.length === 0 ? (<tr><td colSpan="4" className="p-8 text-center text-gray-500">No pending applications.</td></tr>) : 
                                pending.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleApprove(user._id)} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold mr-2"><FaCheck /> Approve</button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"><FaTimes /> Reject</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
};
export default DesignerApprovals;