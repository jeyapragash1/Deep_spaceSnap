// src/pages/dashboards/AdminDashboardPage.jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
// Import the actual component code you provided
import AdminDashboard from '../../features/dashboard/AdminDashboard'; 

const AdminDashboardPage = () => {
    return (
        <MainLayout>
            <AdminDashboard />
        </MainLayout>
    );
};

export default AdminDashboardPage;