// src/hooks/useAuth.jsx

import React, { createContext, useContext, useState } from 'react';

// This is our mock user data. You can change the role to test different navbar views.
// Roles: 'admin', 'designer', 'premium', 'registered'
const mockUser = {
  name: 'Jeyapragash',
  email: 'test@user.com',
  role: 'premium', 
  avatar: 'https://i.pravatar.cc/150' // A random placeholder avatar
};

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
// This component will wrap your entire app and manage the auth state.
export const AuthProvider = ({ children }) => {
  // Set the initial state to 'null' (logged out) or 'mockUser' (logged in) for testing
  const [user, setUser] = useState(null); 

  // In a real app, this function would call your backend API
  const login = (email, password) => {
    console.log("Pretending to log in...");
    setUser(mockUser); // For now, just set the user to our mock data
  };

  // In a real app, this would also call a backend API
  const logout = () => {
    console.log("Logging out...");
    setUser(null);
  };

  // The value that will be available to all components that use this context
  const value = { 
    user,       // The current user object or null
    isAuthenticated: !!user, // A boolean to easily check if logged in
    login,      // The login function
    logout      // The logout function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the custom hook
// This is the hook that your Navbar and other components will use to access the auth state.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};