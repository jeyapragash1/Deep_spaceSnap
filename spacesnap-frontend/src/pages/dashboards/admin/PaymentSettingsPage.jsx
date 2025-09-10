// // spacesnap-frontend/src/pages/dashboards/admin/PaymentSettingsPage.jsx

// import React, { useState, useEffect } from 'react';
// import api from '../../../api/axiosConfig';
// import { Loader2, Save, CreditCard, ArrowLeft } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const PaymentSettingsPage = () => {
//     const [settings, setSettings] = useState({
//         stripeEnabled: true,
//         stripePublishableKey: '',
//         stripeSecretKey: '', // This will be masked
//     });
//     const [loading, setLoading] = useState(true);
//     const [isSaving, setIsSaving] = useState(false);
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         const fetchSettings = async () => {
//             try {
//                 const { data } = await api.get('/admin/settings');
//                 if (data.paymentGateway) {
//                     setSettings({
//                         ...data.paymentGateway,
//                         stripeSecretKey: '••••••••••••••••••••' // Mask the secret key for security
//                     });
//                 }
//             } catch (err) {
//                 setError('Failed to fetch payment settings.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchSettings();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setSettings(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setIsSaving(true);
//         setError('');
//         setSuccessMessage('');

//         // Create a payload, but don't send the masked secret key unless it has been changed
//         const payload = { ...settings };
//         if (payload.stripeSecretKey === '••••••••••••••••••••') {
//             delete payload.stripeSecretKey; // Don't send the mask
//         }

//         try {
//             const { data } = await api.put('/admin/payment-settings', payload);
//             setSuccessMessage(data.msg);
//             // Re-mask the key after a successful save if it was changed
//             if (payload.stripeSecretKey) {
//                  setSettings(prev => ({ ...prev, stripeSecretKey: '••••••••••••••••••••' }));
//             }
//         } catch (err) {
//             setError('Failed to save settings. Please try again.');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
//     }

//     return (
//         <div className="space-y-6 max-w-4xl mx-auto">
//             <Link to="/admin/settings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
//                 <ArrowLeft size={18} /> Back to System Settings
//             </Link>
            
//             <div className="flex items-center gap-3">
//                 <CreditCard size={32} />
//                 <h1 className="text-3xl font-bold">Payment Gateway Settings</h1>
//             </div>

//             <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow border space-y-6">
//                 <h2 className="text-xl font-semibold border-b pb-3">Stripe Configuration</h2>

//                 <div className="flex items-center justify-between p-4 border rounded-md">
//                     <div>
//                         <h3 className="font-semibold">Enable Stripe</h3>
//                         <p className="text-sm text-gray-500">
//                             Allow users to pay using Stripe.
//                         </p>
//                     </div>
//                     <input 
//                         type="checkbox" 
//                         name="stripeEnabled"
//                         checked={settings.stripeEnabled}
//                         onChange={handleInputChange}
//                         className="h-6 w-6 rounded text-indigo-600 focus:ring-indigo-500"
//                     />
//                 </div>
                
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Stripe Publishable Key</label>
//                     <input
//                         type="text"
//                         name="stripePublishableKey"
//                         value={settings.stripePublishableKey}
//                         onChange={handleInputChange}
//                         placeholder="pk_test_..."
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                     />
//                 </div>
                
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Stripe Secret Key</label>
//                     <input
//                         type="password"
//                         name="stripeSecretKey"
//                         value={settings.stripeSecretKey}
//                         onChange={handleInputChange}
//                         placeholder="sk_test_... (leave unchanged to keep existing key)"
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                     />
//                 </div>
                
//                 {error && <p className="text-red-500 text-sm">{error}</p>}
//                 {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
//                 >
//                     {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
//                     {isSaving ? 'Saving...' : 'Save Payment Settings'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default PaymentSettingsPage;

// src/pages/dashboards/admin/PaymentSettings.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Save, CreditCard, Key } from 'lucide-react';

const PaymentSettings = () => {
    const [settings, setSettings] = useState({
        stripePublishableKey: '',
        stripeSecretKey: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // We'll create this backend endpoint next
                const { data } = await api.get('/admin/settings/payments');
                setSettings({
                    stripePublishableKey: data.stripePublishableKey || '',
                    stripeSecretKey: data.stripeSecretKey || ''
                });
            } catch (error) {
                setMessage({ type: 'error', text: 'Could not load payment settings.' });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            // We'll create this backend endpoint next
            await api.post('/admin/settings/payments', settings);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Gateway Settings</h1>
            <p className="text-gray-600 mb-8">Manage your Stripe API keys. These are stored securely on the server.</p>
            
            <div className="bg-white p-8 rounded-xl shadow-md border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="stripePublishableKey" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Key size={16} /> Stripe Publishable Key
                        </label>
                        <input
                            type="text"
                            id="stripePublishableKey"
                            name="stripePublishableKey"
                            value={settings.stripePublishableKey}
                            onChange={handleInputChange}
                            placeholder="pk_test_..."
                            className="w-full p-2 border rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">This key is used on the frontend and is safe to expose.</p>
                    </div>

                    <div>
                        <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Key size={16} /> Stripe Secret Key
                        </label>
                        <input
                            type="password"
                            id="stripeSecretKey"
                            name="stripeSecretKey"
                            value={settings.stripeSecretKey}
                            onChange={handleInputChange}
                            placeholder="sk_test_..."
                            className="w-full p-2 border rounded-md"
                        />
                         <p className="text-xs text-gray-500 mt-1">This key is highly sensitive and is only stored on the server.</p>
                    </div>

                    <div className="flex justify-end items-center">
                        {message.text && (
                            <p className={`text-sm font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 ml-4"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentSettings;