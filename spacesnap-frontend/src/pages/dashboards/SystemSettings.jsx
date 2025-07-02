// src/pages/admin/SystemSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';

const SystemSettingsPage = () => {
    const [settings, setSettings] = useState({
        siteName: '',
        maintenanceMode: false,
        premiumPrice: 0,
        allowRegistrations: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/settings');
                setSettings(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('spaceSnapToken');
            await axios.put('http://localhost:5000/api/admin/settings', settings, {
                headers: { 'x-auth-token': token }
            });
            alert('Settings saved successfully!');
        } catch (err) {
            alert('Failed to save settings.');
        }
    };
    
    if (loading) return <AdminDashboardLayout><p>Loading settings...</p></AdminDashboardLayout>;

    return (
        <AdminDashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-6">System Settings</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Site Name</label>
                        <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Premium Price (INR)</label>
                        <input type="number" name="premiumPrice" value={settings.premiumPrice} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="mr-2 h-4 w-4" />
                        <label>Enable Maintenance Mode</label>
                    </div>
                    <div className="mb-6 flex items-center">
                        <input type="checkbox" name="allowRegistrations" checked={settings.allowRegistrations} onChange={handleChange} className="mr-2 h-4 w-4" />
                        <label>Allow New User Registrations</label>
                    </div>
                    <button onClick={handleSave} className="bg-primary-teal text-white font-bold py-2 px-6 rounded-lg">
                        Save Settings
                    </button>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default SystemSettingsPage;