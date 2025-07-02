// src/pages/dashboards/admin/UserManagementPage.jsx
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
    
    // ... (rest of the component logic for deleting users)

    if (loading) return <AdminDashboardLayout><p>Loading...</p></AdminDashboardLayout>;

    return (
        <AdminDashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">User Management</h1>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        {/* Table Header and Body from previous response */}
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default UserManagementPage;