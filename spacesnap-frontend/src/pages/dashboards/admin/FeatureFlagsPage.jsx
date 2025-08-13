// src/pages/dashboards/admin/FeatureFlagsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Save, ToggleRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureFlagsPage = () => {
    const [flags, setFlags] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // --- THIS IS THE FIX ---
                const { data } = await api.get('/admin/settings');
                setFlags(data.featureFlags || {});
            } catch (err) {
                setError('Failed to fetch settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = (key) => {
        setFlags(prevFlags => ({
            ...prevFlags,
            [key]: !prevFlags[key],
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // --- THIS IS THE FIX ---
            await api.put('/admin/settings', { featureFlags: flags });
            alert('Settings saved successfully!');
        } catch (err) {
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }

    if (error) {
        return <p className="text-red-500 font-semibold">{error}</p>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/admin/settings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                <ArrowLeft size={18} /> Back to System Settings
            </Link>
            
            <div className="flex items-center gap-3">
                <ToggleRight size={32} />
                <h1 className="text-3xl font-bold">Feature Flags</h1>
            </div>

            <p className="text-gray-600">
                Enable or disable features in real-time without deploying new code.
                Changes may require users to refresh their page to take effect.
            </p>

            <div className="bg-white p-6 rounded-lg shadow border space-y-4">
                {Object.keys(flags).length > 0 ? (
                    Object.keys(flags).map(key => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                                <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                                <p className="text-sm text-gray-500">
                                    Currently {flags[key] ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle(key)}
                                className={`w-14 h-8 rounded-full flex items-center transition-colors p-1 ${flags[key] ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${flags[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No feature flags configured in the backend.</p>
                )}
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
            >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default FeatureFlagsPage;