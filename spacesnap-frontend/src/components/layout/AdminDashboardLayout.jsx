// src/components/layout/AdminDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardHeader from './DashboardHeader';

const AdminDashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
                    {/* The Outlet renders the specific admin page (e.g., overview, users) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;