// src/pages/dashboards/AccountPage.jsx

import React, { useState, useEffect } from 'react';
// --- MODIFIED: Destructure the new 'updateUserContext' function ---
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { User, Shield, Key, Loader2 } from 'lucide-react';

// Reusable UI components for this page (unchanged)
const Card = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
            {icon} {title}
        </h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);
const Input = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" {...props} />
    </div>
);
const Button = ({ isLoading, children, ...props }) => (
    <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400" {...props}>
        {isLoading ? <Loader2 className="animate-spin" /> : children}
    </button>
);

const AccountPage = () => {
    // --- MODIFIED: Get the new function from our context ---
    const { user, updateUserContext } = useAuth();

    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    // --- MODIFIED: The success block now updates the global state ---
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });
        try {
            const res = await api.put('/users/profile', { name: profileData.name });
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // --- THIS IS THE FIX ---
            // Update the user in the global auth context so the name
            // changes in the header instantly without a page refresh.
            updateUserContext({ user: res.data });
            
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to update profile.';
            setProfileMessage({ type: 'error', text: errorMsg });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });
        try {
            const res = await api.post('/users/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });
            setPasswordMessage({ type: 'success', text: res.data.msg });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to change password.';
            setPasswordMessage({ type: 'error', text: errorMsg });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>

            <Card title="Profile Information" icon={<User />}>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <Input label="Full Name" id="name" name="name" type="text" value={profileData.name} onChange={handleProfileChange} />
                    <Input label="Email Address" id="email" name="email" type="email" value={profileData.email} disabled readOnly />
                    <div className="text-right">
                        <Button type="submit" isLoading={profileLoading} disabled={profileLoading}>
                            Save Changes
                        </Button>
                    </div>
                    {profileMessage.text && (
                        <p className={`mt-2 text-sm ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{profileMessage.text}</p>
                    )}
                </form>
            </Card>

            <Card title="Change Password" icon={<Shield />}>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input label="Current Password" id="oldPassword" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                    <Input label="New Password" id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                    <Input label="Confirm New Password" id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                    <div className="text-right">
                        <Button type="submit" isLoading={passwordLoading} disabled={passwordLoading}>
                            <Key size={16}/> Change Password
                        </Button>
                    </div>
                     {passwordMessage.text && (
                        <p className={`mt-2 text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage.text}</p>
                    )}
                </form>
            </Card>
        </div>
    );
};

export default AccountPage;