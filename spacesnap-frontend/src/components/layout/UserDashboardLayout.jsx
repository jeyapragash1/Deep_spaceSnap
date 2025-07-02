// src/components/layout/UserDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import DashboardHeader from './DashboardHeader';

const UserDashboardLayout = () => {
    return (
        <div className="flex h-screen bg-neutral-light">
            <UserSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-8">
                    {/* The Outlet renders the specific page (e.g., UserProfilePage) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;