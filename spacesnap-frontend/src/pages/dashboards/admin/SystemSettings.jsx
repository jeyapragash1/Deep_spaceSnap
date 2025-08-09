// src/pages/dashboards/admin/SystemSettings.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, ToggleRight, Settings } from 'lucide-react';

// A reusable card component for each setting category
const SettingsCard = ({ title, description, buttonText, linkTo, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col">
        <div className="flex items-start gap-4">
            <div className="text-indigo-600 bg-indigo-100 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
        <div className="mt-auto pt-4 text-right">
             {/* Use Link component for navigation */}
             <Link
                to={linkTo}
                className="inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                {buttonText}
            </Link>
        </div>
    </div>
);


const SystemSettings = () => {
    // This page is now primarily for navigation to the detailed settings pages.
    // The individual data fetching is handled by those pages.

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Settings className="text-gray-800" size={32}/>
                <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
            </div>
            
            <p className="text-gray-600">
                Configure core aspects of the SpaceSnap platform from this control center.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsCard 
                    title="Payment Gateway"
                    description="Manage Stripe or Razorpay API keys and settings."
                    buttonText="Configure Payments"
                    icon={<CreditCard size={24}/>}
                    linkTo="/admin/payment-settings" // A placeholder link for the future
                />
                <SettingsCard 
                    title="Email Templates"
                    description="Edit the content of emails sent to users (e.g., password reset)."
                    buttonText="Manage Templates"
                    icon={<Mail size={24}/>}
                    linkTo="/admin/email-templates" // Link to the new page
                />
                <SettingsCard 
                    title="Feature Flags"
                    description="Enable or disable specific features across the platform."
                    buttonText="Toggle Features"
                    icon={<ToggleRight size={24}/>}
                    linkTo="/admin/feature-flags" // Link to the new page
                />
            </div>
        </div>
    );
};

export default SystemSettings;