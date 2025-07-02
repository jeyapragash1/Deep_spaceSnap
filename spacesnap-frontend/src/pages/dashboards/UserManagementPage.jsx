// src/pages/dashboards/UserManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { FaTrash, FaUserEdit } from 'react-icons/fa';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/users');
                setUsers(res.data);
            } catch (err) { console.error("Failed to fetch users:", err); }
            finally { setLoading(false); }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => { /* ... delete logic ... */ };

    if (loading) {
        return <AdminDashboardLayout><p>Loading users...</p></AdminDashboardLayout>;
    }

    return (
        <AdminDashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">User Management</h1>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 capitalize">{user.role}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="text-gray-500 hover:text-blue-600"><FaUserEdit /></button>
                                        <button onClick={() => handleDelete(user._id)} className="text-gray-500 hover:text-red-600"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default UserManagementPage;