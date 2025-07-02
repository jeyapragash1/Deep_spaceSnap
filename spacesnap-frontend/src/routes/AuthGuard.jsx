// src/routes/AuthGuard.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner'; // Make sure you have this component

const AuthGuard = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // 1. Show loading spinner while checking auth status
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // 2. If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If authenticated, decide where to send them
    // This part handles the role-based redirection
    if (location.pathname === '/dashboard') {
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'designer':
                return <Navigate to="/designer/dashboard" replace />;
            default:
                return <Navigate to="/user/profile" replace />;
        }
    }
    
    // 4. If they are authenticated and NOT at the gateway '/dashboard' path,
    // let them proceed to the page they requested (e.g., /style-quiz).
    // The <Outlet/> renders the child component.
    return <Outlet />;
};

export default AuthGuard;