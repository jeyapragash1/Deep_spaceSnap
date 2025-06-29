import React, { createContext, useContext, useState } from 'react';

// This is our mock user data. We can change the role to test the navbar.
// Possible roles: 'admin', 'designer', 'premium', 'registered'
const mockUser = {
  name: 'Jeyapragash',
  email: 'jeyapragash@test.com',
  role: 'premium',
  avatar: 'https://i.pravatar.cc/150' // A random placeholder avatar image
};

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // To test the "logged in" view, change `null` to `mockUser`
  // To test the "logged out" view, keep it as `null`
  const [user, setUser] = useState(null);

  const login = () => {
    console.log("Logging in with mock user...");
    setUser(mockUser);
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
  };

  const value = { user, isAuthenticated: !!user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};