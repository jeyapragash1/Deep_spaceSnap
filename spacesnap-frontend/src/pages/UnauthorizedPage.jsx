// src/pages/UnauthorizedPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-6xl font-extrabold text-red-600 mb-4">403</h1>
                <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
                <Link to="/dashboard" className="bg-primary-teal text-white px-6 py-3 rounded-lg font-semibold">
                    Go to My Dashboard
                </Link>
            </div>
        </MainLayout>
    );
};

export default UnauthorizedPage;