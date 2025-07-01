// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We start with 'undefined' to represent a "loading" state before we check for a token.
  const [user, setUser] = useState(undefined);

  // This effect runs once when the app first loads.
  // It checks for a token in local storage to keep the user logged in.
  useEffect(() => {
    const token = localStorage.getItem('spaceSnapToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('spaceSnapToken');
          setUser(null); // Token is expired, so the user is logged out
        } else {
          // If the token is valid, set the user state
          setUser(decoded.user);
        }
      } catch (error) {
        // If the token is invalid for any reason, clear it
        localStorage.removeItem('spaceSnapToken');
        setUser(null);
      }
    } else {
      setUser(null); // No token found, so the user is logged out
    }
  }, []);


  // Login function that calls our backend API
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token } = res.data;
      
      localStorage.setItem('spaceSnapToken', token);
      const decoded = jwtDecode(token);
      setUser(decoded.user); // Set user state from the new token
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
          throw new Error(err.response.data.msg);
        } else {
          throw new Error('An unexpected error occurred. Please try again.');
        }
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('spaceSnapToken');
    setUser(null);
    // A simple way to force a redirect and clear any component state
    window.location.href = '/login'; 
  };
  
  // This new function is called after a successful upgrade to update the user's role
  const updateUserToken = (token) => {
    try {
      localStorage.setItem('spaceSnapToken', token);
      const decoded = jwtDecode(token);
      setUser(decoded.user); // Update the user state with the new data from the new token
    } catch (error) {
      console.error("Failed to update token:", error);
      // If updating the token fails for some reason, log the user out for safety
      logout();
    }
  };

  // The value provided to all components that use this context
  const value = { 
    user, 
    isAuthenticated: !!user, // True if 'user' object exists, false if 'user' is null
    login, 
    logout,
    updateUserToken // Export the new function
  };

  // We don't render the rest of the app until we know for sure if the user is logged in or out.
  // This 'user !== undefined' check prevents a "flicker" on page load.
  return (
    <AuthContext.Provider value={value}>
      {user !== undefined && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};