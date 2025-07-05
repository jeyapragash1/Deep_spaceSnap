// src/pages/dashboards/admin/SystemSettings.jsx
import React from 'react';
import Button from '../../../components/common/Button';

const SystemSettings = () => {
    return (
         <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">System Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Payment Gateway</h2>
                    <p className="text-gray-600 mb-4">Manage Stripe or Razorpay API keys and settings.</p>
                    <Button>Configure Payments</Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
                    <p className="text-gray-600 mb-4">Edit the content of emails sent to users (e.g., password reset).</p>
                    <Button>Manage Templates</Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Feature Flags</h2>
                    <p className="text-gray-600 mb-4">Enable or disable specific features across the platform.</p>
                    <Button>Toggle Features</Button>
                </div>
            </div>
        </div>
    );
};
export default SystemSettings;