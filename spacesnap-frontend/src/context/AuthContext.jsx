// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Make sure to run: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // undefined means "loading"
    const [token, setToken] = useState(localStorage.getItem('spaceSnapToken'));

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) { // Check if token is expired
                    logout();
                } else {
                    setUser(decoded.user);
                    axios.defaults.headers.common['x-auth-token'] = token;
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        } else {
            setUser(null); // null means "not logged in"
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('spaceSnapToken', res.data.token);
            setToken(res.data.token);
        } catch (err) {
            logout();
            throw new Error(err.response?.data?.msg || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('spaceSnapToken');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading: user === undefined,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};