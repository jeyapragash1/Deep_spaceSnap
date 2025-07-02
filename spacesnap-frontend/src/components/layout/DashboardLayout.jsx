// src/components/layout/AdminDashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

// --- THIS IS THE CRUCIAL FIX ---
// We now import the sidebar from the SAME folder ('./').
// This is the simple and correct path.
import AdminSidebar from './AdminSidebar';
import DashboardHeader from './DashboardHeader'; // This should also be in the 'layout' folder

const AdminDashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-neutral-light">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6">
                    {/* 
                      This Outlet component is used for nested routing.
                      It renders the specific page content (e.g., User Management).
                      We pass 'children' as a fallback for your flat routing structure.
                    */}
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;