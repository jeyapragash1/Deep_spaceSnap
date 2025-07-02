// src/pages/admin/DesignerApprovalsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DesignerApprovalsPage = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingDesigners = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('spaceSnapToken');
            // This API call fetches all users with the role 'registered'
            const res = await axios.get('http://localhost:5000/api/designers/pending', {
                headers: { 'x-auth-token': token }
            });
            setPending(res.data);
        } catch (err) {
            console.error("Failed to fetch pending designers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDesigners();
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('spaceSnapToken');
            await axios.put(`http://localhost:5000/api/designers/approve/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            // After approving, refresh the list to remove them from pending
            fetchPendingDesigners();
        } catch (err) {
            console.error('Approval failed:', err);
            alert('Could not approve designer.');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject this application? This will delete the user.')) {
            try {
                const token = localStorage.getItem('spaceSnapToken');
                await axios.put(`http://localhost:5000/api/designers/reject/${id}`, {}, {
                    headers: { 'x-auth-token': token }
                });
                // After rejecting, refresh the list
                fetchPendingDesigners();
            } catch (err) {
                console.error('Rejection failed:', err);
                alert('Could not reject application.');
            }
        }
    };

    return (
        <AdminDashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">Designer Approvals</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {loading ? (
                        <p>Loading applications...</p>
                    ) : pending.length === 0 ? (
                        <p className="text-gray-500">There are no pending designer applications.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4 flex gap-4">
                                            <button onClick={() => handleApprove(user._id)} className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 text-sm rounded-full hover:bg-green-600">
                                                <FaCheck /> Approve
                                            </button>
                                            <button onClick={() => handleReject(user._id)} className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 text-sm rounded-full hover:bg-red-600">
                                                <FaTimes /> Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default DesignerApprovalsPage;