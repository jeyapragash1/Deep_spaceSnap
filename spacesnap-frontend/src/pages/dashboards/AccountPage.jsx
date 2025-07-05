// src/pages/dashboards/AccountPage.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaShieldAlt, FaBell } from 'react-icons/fa';

const AccountPage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">Account Settings</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="space-y-6">
                    {/* Profile Information */}
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2"><FaUserCircle /> Profile Information</h2>
                        <div className="mt-4 pl-8 border-l-2">
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
                        </div>
                    </div>
                    {/* Security */}
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2"><FaShieldAlt /> Security</h2>
                         <div className="mt-4 pl-8 border-l-2">
                            <button className="text-primary-teal hover:underline">Change Password</button>
                        </div>
                    </div>
                     {/* Notifications */}
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2"><FaBell /> Notifications</h2>
                         <div className="mt-4 pl-8 border-l-2">
                            <p className="text-gray-500">Notification settings coming soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;