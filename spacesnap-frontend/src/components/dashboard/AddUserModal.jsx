// src/components/dashboard/AddUserModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'registered' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/users', formData);
            alert('User created successfully!');
            onUserAdded(); // Tell the parent page to refresh its user list
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add New User</h2>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" onChange={onChange} required className="w-full p-3 border rounded-md" />
                    <input type="email" name="email" placeholder="Email Address" onChange={onChange} required className="w-full p-3 border rounded-md" />
                    <input type="password" name="password" placeholder="Password" onChange={onChange} required className="w-full p-3 border rounded-md" />
                    <select name="role" onChange={onChange} value={formData.role} className="w-full p-3 border rounded-md">
                        <option value="registered">Registered</option>
                        <option value="premium">Premium</option>
                        <option value="designer">Designer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-primary-teal text-white font-bold py-2 px-6 rounded-lg">{loading ? 'Creating...' : 'Create User'}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddUserModal;