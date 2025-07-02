// src/components/layout/AdminDashboardLayout.jsx

import React from 'react';

// --- THIS IS THE CRUCIAL FIX ---
// We now import both components from the SAME folder ('./').
// This is the simple and correct path.
import AdminSidebar from './AdminSidebar';
import DashboardHeader from './DashboardHeader';

const AdminDashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-neutral-light">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6">
                    {/* The specific page content (like the charts or user list) will be passed in as 'children' */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;