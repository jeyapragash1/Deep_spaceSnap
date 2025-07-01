// src/components/layout/DashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header1';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    
    return (
        <div className="flex h-screen bg-neutral-light">
            <Sidebar userRole={user?.role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;