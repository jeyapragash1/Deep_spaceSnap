// src/pages/dashboards/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

// A debounce hook to prevent API calls on every keystroke
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Wait 500ms after user stops typing

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/users?search=${debouncedSearchTerm}`);
            setUsers(res.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`);
                // Refresh the user list after deletion
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user.');
                console.error(err);
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-dark">User Management</h1>
                <button className="bg-primary-teal text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90">
                    <FaPlus /> Add New User
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Search and Filter Bar */}
                <div className="mb-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaSearch className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Joined Date</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-8">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" className="text-center p-8 text-red-500">{error}</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://source.unsplash.com/150x150/?portrait,person,${user._id}`} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                            user.role === 'designer' ? 'bg-blue-100 text-blue-800' :
                                            user.role === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>{user.role}</span></td>
                                        <td className="p-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <button className="text-blue-600 hover:text-blue-800 mr-4"><FaUserEdit /></button>
                                            <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;