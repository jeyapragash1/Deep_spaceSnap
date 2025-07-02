// src/routes/ProtectedLayout.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner'; // Make sure you have this component

const ProtectedLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // 1. Show a full-screen loading spinner while the AuthContext is checking for a token.
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-light">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    // 2. If finished loading and the user is NOT authenticated, redirect them to the login page.
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If the user IS authenticated, render the child route they requested.
    // <Outlet /> is a special component that acts as a placeholder for nested routes.
    return <Outlet />;
};

export default ProtectedLayout;