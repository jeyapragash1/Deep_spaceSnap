// src/pages/dashboards/admin/DesignerApprovals.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Check, X, User, Mail } from 'lucide-react';

const DesignerApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPendingDesigners = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/pending-designers');
            setPending(res.data);
        } catch (err) {
            setError('Failed to load pending designers. You may not have admin rights.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDesigners();
    }, []);

    const handleApprove = async (userId) => {
        try {
            await api.put(`/admin/approve-designer/${userId}`);
            // Remove the user from the list on success
            setPending(prev => prev.filter(user => user._id !== userId));
        } catch (err) {
            alert('Failed to approve designer.');
            console.error(err);
        }
    };

    const handleReject = async (userId) => {
        if (window.confirm('Are you sure you want to reject and delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/reject-designer/${userId}`);
                // Remove the user from the list on success
                setPending(prev => prev.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to reject designer.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }
    
    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Designer Approvals</h1>
            <p className="text-gray-600">Review registered users who want to become designers on the platform.</p>

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Registered On</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pending.length > 0 ? (
                                pending.map(user => (
                                    <tr key={user._id}>
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium text-gray-900 flex items-center gap-2"><User size={14}/> {user.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={14}/> {user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-3">
                                                <button 
                                                    onClick={() => handleApprove(user._id)}
                                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(user._id)}
                                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-8 text-gray-500">
                                        There are no pending designer applications.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DesignerApprovals;