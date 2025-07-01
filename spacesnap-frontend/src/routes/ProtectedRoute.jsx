// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner'; // We will use this for a nice loading effect

// This component will wrap our dashboard pages
// It takes 'children' (the page we want to show) and 'allowedRoles' as props
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    
    // --- This part is important for the initial page load ---
    // If the authentication state is still loading, 'user' might be null briefly.
    // In a real app with an async check, you'd have a 'loading' state.
    // For our mock context, this is a simple check.
    const isLoading = user === undefined; 

    if (isLoading) {
        // Show a full-page loading spinner while we determine the user's auth state
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    // 1. Check if the user is authenticated (logged in)
    if (!isAuthenticated) {
        // If not logged in, redirect them to the login page
        // We also pass the page they tried to visit, so we can redirect them back after login.
        console.log("Access Denied: User not authenticated. Redirecting to /login.");
        return <Navigate to="/login" replace />;
    }

    // 2. Check if the user has one of the allowed roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If the user's role is not in the allowed list, redirect them to a "not authorized" page
        // or back to their own dashboard.
        console.log(`Access Denied: User role '${user.role}' is not in allowed roles [${allowedRoles}]. Redirecting to /unauthorized.`);
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. If all checks pass, render the page they requested
    return children;
};

export default ProtectedRoute;