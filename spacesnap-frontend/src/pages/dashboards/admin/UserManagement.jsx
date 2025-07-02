// src/pages/dashboards/admin/UserManagement.jsx
import React from 'react';

const UserManagement = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>A table of all users will be displayed here, with options to edit or delete them.</p>
                <p>This will fetch data from your `/api/users` backend endpoint.</p>
            </div>
        </div>
    );
};

export default UserManagement;