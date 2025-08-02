// src/pages/dashboards/admin/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Trash, User, Mail, Shield } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(prev => prev.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to delete user.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                <th className="p-4 font-semibold text-gray-600">Joined On</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            user.role === 'designer' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;