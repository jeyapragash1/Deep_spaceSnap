// src/context/AuthContext.jsx

import React, { createContext, useContext, useState } from 'react';

const mockUser = {
  name: 'Jeyapragash',
  email: 'jeyapragash@test.com',
  role: 'premium',
  // NEW and reliable: Fetches a random portrait photo from Unsplash
  avatar: 'https://source.unsplash.com/150x150/?portrait,person' 
};

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const login = () => {
    console.log("Logging in with mock user...");
    setUser(mockUser); 
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
  };

  const value = { 
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};