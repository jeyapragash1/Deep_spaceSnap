// src/routes/RoleBasedRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  // This component assumes the user is already authenticated because it's
  // rendered inside the ProtectedLayout. Its only job is to redirect.
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'designer':
      return <Navigate to="/designer/dashboard" replace />;
    case 'premium':
    case 'registered':
    default:
      return <Navigate to="/user/profile" replace />;
  }
};

export default RoleBasedRedirect;