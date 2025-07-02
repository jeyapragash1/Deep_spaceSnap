// spacesnap-frontend/src/pages/dashboards/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Fetch data from your backend API
                const res = await axios.get('http://localhost:5000/api/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                // Update UI instantly by filtering out the deleted user
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                console.error("Failed to delete user:", err);
            }
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-3 py-1 text-xs rounded-full">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;