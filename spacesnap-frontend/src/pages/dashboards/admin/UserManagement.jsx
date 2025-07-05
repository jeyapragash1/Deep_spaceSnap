// src/pages/dashboards/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

const useDebounce = (value, delay) => { /* ... existing correct code ... */ };

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            // --- THE FIX: Call the correct admin route ---
            const res = await axios.get(`http://localhost:5000/api/admin/users?search=${debouncedSearchTerm}`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure?')) {
            try {
                // --- THE FIX: Call the correct admin delete route ---
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
                fetchUsers(); // Refresh the list
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button className="bg-primary-teal text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                   
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4"><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center"><FaSearch className="text-gray-400" /></span><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 py-2 border rounded-lg"/></div></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50 border-b"><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Joined Date</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {loading ? (<tr><td colSpan="4" className="p-8 text-center">Loading...</td></tr>) : 
                                users.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4"><div className="flex items-center gap-3"><img src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`} alt="avatar" className="w-10 h-10 rounded-full" /><div><p className="font-medium">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></div></div></td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'designer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                                        <td className="p-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center"><button className="text-blue-600 mr-4"><FaUserEdit /></button><button onClick={() => handleDelete(user._id)} className="text-red-600"><FaTrash /></button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UserManagement;