// src/pages/dashboard/AccountPage.jsx
import React from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const AccountPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form>
          <InputField label="Full Name" type="text" name="name" defaultValue="Jeyapragash" />
          <InputField label="Email Address" type="email" name="email" defaultValue="test@user.com" />
          <InputField label="Current Password" type="password" name="currentPassword" />
          <InputField label="New Password" type="password" name="newPassword" />
          <Button type="submit" className="w-full mt-4">Update Profile</Button>
        </form>
      </div>
    </div>
  );
};
export default AccountPage;