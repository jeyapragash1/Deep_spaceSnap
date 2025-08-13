// spacesnap-frontend/src/pages/dashboards/admin/PaymentSettingsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Save, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSettingsPage = () => {
    const [settings, setSettings] = useState({
        stripeEnabled: true,
        stripePublishableKey: '',
        stripeSecretKey: '', // This will be masked
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/admin/settings');
                if (data.paymentGateway) {
                    setSettings({
                        ...data.paymentGateway,
                        stripeSecretKey: '••••••••••••••••••••' // Mask the secret key for security
                    });
                }
            } catch (err) {
                setError('Failed to fetch payment settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        // Create a payload, but don't send the masked secret key unless it has been changed
        const payload = { ...settings };
        if (payload.stripeSecretKey === '••••••••••••••••••••') {
            delete payload.stripeSecretKey; // Don't send the mask
        }

        try {
            const { data } = await api.put('/admin/payment-settings', payload);
            setSuccessMessage(data.msg);
            // Re-mask the key after a successful save if it was changed
            if (payload.stripeSecretKey) {
                 setSettings(prev => ({ ...prev, stripeSecretKey: '••••••••••••••••••••' }));
            }
        } catch (err) {
            setError('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/admin/settings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                <ArrowLeft size={18} /> Back to System Settings
            </Link>
            
            <div className="flex items-center gap-3">
                <CreditCard size={32} />
                <h1 className="text-3xl font-bold">Payment Gateway Settings</h1>
            </div>

            <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow border space-y-6">
                <h2 className="text-xl font-semibold border-b pb-3">Stripe Configuration</h2>

                <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                        <h3 className="font-semibold">Enable Stripe</h3>
                        <p className="text-sm text-gray-500">
                            Allow users to pay using Stripe.
                        </p>
                    </div>
                    <input 
                        type="checkbox" 
                        name="stripeEnabled"
                        checked={settings.stripeEnabled}
                        onChange={handleInputChange}
                        className="h-6 w-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stripe Publishable Key</label>
                    <input
                        type="text"
                        name="stripePublishableKey"
                        value={settings.stripePublishableKey}
                        onChange={handleInputChange}
                        placeholder="pk_test_..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stripe Secret Key</label>
                    <input
                        type="password"
                        name="stripeSecretKey"
                        value={settings.stripeSecretKey}
                        onChange={handleInputChange}
                        placeholder="sk_test_... (leave unchanged to keep existing key)"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : 'Save Payment Settings'}
                </button>
            </form>
        </div>
    );
};

export default PaymentSettingsPage;