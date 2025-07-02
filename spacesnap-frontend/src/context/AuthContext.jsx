// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create the context
const AuthContext = createContext(null);

// This is a helper function to set the authentication token for all future axios requests
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export const AuthProvider = ({ children }) => {
    // --- STATE ---
    // 'token' is the raw JWT string from localStorage.
    const [token, setToken] = useState(localStorage.getItem('spaceSnapToken'));
    // 'user' is the decoded user object. 'undefined' means we are still checking. 'null' means not logged in.
    const [user, setUser] = useState(undefined);

    // --- EFFECT HOOK ---
    // This effect runs whenever the 'token' state changes, keeping everything in sync.
    useEffect(() => {
        if (token) {
            localStorage.setItem('spaceSnapToken', token);
            setAuthToken(token);
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    setToken(null); // Token is expired, clear it
                } else {
                    setUser(decoded.user); // Token is valid, set the user
                }
            } catch (error) {
                console.error("Invalid token found in storage.", error);
                setToken(null); // If token is malformed, clear it
            }
        } else {
            // No token, so clear everything
            localStorage.removeItem('spaceSnapToken');
            setAuthToken(null);
            setUser(null);
        }
    }, [token]);

    // --- ACTION FUNCTIONS ---
    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            setToken(res.data.token); // This is the key: setting the token triggers the useEffect hook
        } catch (err) {
            setToken(null); // Ensure state is clean after a failed login
            throw new Error(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        }
    };

    const logout = () => {
        setToken(null); // Setting token to null triggers the useEffect to clear everything
    };

    // This function is used after OTP verification or a role upgrade
    const updateUserToken = (newToken) => {
        setToken(newToken);
    };

    // The value provided to all child components
    const value = {
        user,
        isAuthenticated: !!user, // This will be true only when user is an object
        isLoading: user === undefined, // The app is "loading" until the user state is determined
        login,
        logout,
        updateUserToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the context
export const useAuth = () => useContext(AuthContext);