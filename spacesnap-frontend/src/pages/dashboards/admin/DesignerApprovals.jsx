// src/pages/dashboards/admin/DesignerApprovals.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const DesignerApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch pending designers from your backend
    const fetchPendingDesigners = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            // --- THIS IS THE FIX ---
            // We now call the correct endpoint that you created: '/api/designers/pending'
            const res = await axios.get('http://localhost:5000/api/designers/pending');
            setPending(res.data);
        } catch (err) {
            setError('Failed to fetch pending applications. Please ensure you are logged in as an admin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Use useEffect to fetch data when the component first loads
    useEffect(() => {
        fetchPendingDesigners();
    }, [fetchPendingDesigners]);

    // Handler for the "Approve" button
    const handleApprove = async (userId) => {
        if (window.confirm('Are you sure you want to approve this user? Their role will be changed to "designer".')) {
            try {
                // --- THIS IS THE FIX ---
                // We now call the correct approval endpoint: '/api/designers/approve/:id'
                await axios.put(`http://localhost:5000/api/designers/approve/${userId}`);
                // Refresh the list by filtering out the approved user from the UI instantly
                setPending(prevPending => prevPending.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to approve designer.');
                console.error(err);
            }
        }
    };

    // Handler for the "Reject" button
    const handleReject = async (userId) => {
        if (window.confirm('Are you sure you want to reject and delete this application? This action cannot be undone.')) {
            try {
                // --- THIS IS THE FIX ---
                // We now call the correct rejection endpoint: '/api/designers/reject/:id'
                await axios.put(`http://localhost:5000/api/designers/reject/${userId}`);
                // Refresh the list by filtering out the rejected user from the UI
                setPending(prevPending => prevPending.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to reject designer.');
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Pending Designer Approvals</h1>
            
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <FaSpinner className="animate-spin text-4xl text-primary-teal" />
                </div>
            )}
            
            {error && <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}

            {!loading && pending.length === 0 && !error && (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 text-lg">There are no pending designer applications at this time.</p>
                </div>
            )}

            {!loading && pending.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Applied On</th>
                                    <th className="p-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center space-x-2">
                                            <button 
                                                onClick={() => handleApprove(user._id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold mr-2 hover:bg-green-600 transition-colors"
                                            >
                                                <FaCheck className="inline mr-1" /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors"
                                            >
                                                <FaTimes className="inline mr-1" /> Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignerApprovals;