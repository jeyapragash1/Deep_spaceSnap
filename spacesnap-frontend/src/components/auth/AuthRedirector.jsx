// src/components/auth/AuthRedirector.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This component doesn't render anything. Its only job is to handle redirects.
const AuthRedirector = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Use a ref to track if this is the initial load or a login event
    const wasAuthenticated = useRef(isAuthenticated);

    useEffect(() => {
        // Don't do anything while auth state is loading
        if (isLoading) {
            return;
        }

        // --- THE CORE LOGIC ---
        // Check if the user's status just changed from "not logged in" to "logged in"
        if (!wasAuthenticated.current && isAuthenticated) {
            console.log("Login detected! Redirecting now...");
            // Find out where the user was trying to go before they were sent to login
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }

        // Update the ref to the current authentication status for the next render
        wasAuthenticated.current = isAuthenticated;

    }, [isAuthenticated, isLoading, navigate, location]);

    // This component renders nothing, it only handles logic.
    return null;
};

export default AuthRedirector;