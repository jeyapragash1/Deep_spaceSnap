// src/pages/dashboards/admin/FeatureFlagsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, ArrowLeft, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Toggle = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const FeatureFlagsPage = () => {
    const [flags, setFlags] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const res = await api.get('/admin/settings');
                setFlags(res.data.featureFlags);
            } catch (err) {
                console.error("Failed to load feature flags:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlags();
    }, []);
    
    const handleToggle = (key) => {
        setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await api.put('/admin/settings', { featureFlags: flags });
            setMessage('Feature flags saved successfully!');
        } catch (err) {
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

    return (
        <div className="space-y-6">
            <Link to="/admin/settings" className="flex items-center gap-2 text-gray-500 font-semibold hover:text-gray-800">
                <ArrowLeft size={18} /> Back to Settings
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Feature Flags</h1>
            <div className="bg-white p-6 rounded-xl border max-w-2xl">
                <p className="text-gray-600 mb-6">Enable or disable core features of the application for all users.</p>
                <ul className="divide-y divide-gray-200">
                    <li className="flex justify-between items-center py-4">
                        <div>
                            <p className="font-semibold">AR Preview</p>
                            <p className="text-sm text-gray-500">Allow users to access the Augmented Reality feature.</p>
                        </div>
                        <Toggle enabled={flags?.arPreviewEnabled} onChange={() => handleToggle('arPreviewEnabled')} />
                    </li>
                    <li className="flex justify-between items-center py-4">
                        <div>
                            <p className="font-semibold">Style Quiz</p>
                            <p className="text-sm text-gray-500">Allow users to take the style preference quiz.</p>
                        </div>
                        <Toggle enabled={flags?.styleQuizActive} onChange={() => handleToggle('styleQuizActive')} />
                    </li>
                    <li className="flex justify-between items-center py-4">
                        <div>
                            <p className="font-semibold">New User Registrations</p>
                            <p className="text-sm text-gray-500">Allow new users to create accounts on the platform.</p>
                        </div>
                        <Toggle enabled={flags?.newRegistrations} onChange={() => handleToggle('newRegistrations')} />
                    </li>
                </ul>
                <div className="flex justify-end items-center gap-4 pt-6 border-t mt-4">
                    {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                    <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:bg-gray-400">
                        {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeatureFlagsPage;