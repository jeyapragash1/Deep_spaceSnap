// src/pages/DashboardGatewayPage.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardGatewayPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // If auth state is loading, show spinner
  if (user === undefined) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
  }
  
  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // --- THE CORE REDIRECTION LOGIC ---
  // Based on the user's role, navigate to the appropriate dashboard.
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'designer':
      return <Navigate to="/designer/dashboard" replace />;
    case 'premium':
    case 'registered':
      return <Navigate to="/user/profile" replace />;
    default:
      // If role is unknown, send them to the landing page.
      return <Navigate to="/" replace />;
  }
};

export default DashboardGatewayPage;