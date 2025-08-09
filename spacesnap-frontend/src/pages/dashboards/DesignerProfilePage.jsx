// src/pages/dashboards/DesignerProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { User, Briefcase, Sparkles, Loader2 } from 'lucide-react';

const Input = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" {...props} />
    </div>
);

const Textarea = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={id} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" {...props}></textarea>
    </div>
);

const DesignerProfilePage = () => {
    const { user, updateUserContext } = useAuth();
    const [formData, setFormData] = useState({ name: '', bio: '', specialties: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                specialties: user.specialties || ''
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/users/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            updateUserContext({ user: res.data });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <div className="bg-white p-8 rounded-xl shadow-md border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full" />
                        <div>
                             <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                             <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    
                    <Input label="Display Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
                    <Textarea label="Bio / Introduction" id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell clients a little about yourself and your design philosophy." />
                    <Input label="Specialties" id="specialties" name="specialties" type="text" value={formData.specialties} onChange={handleChange} placeholder="e.g., Modern, Minimalist, Bohemian" />
                    
                    <div className="text-right">
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>

                    {message.text && (
                        <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DesignerProfilePage;