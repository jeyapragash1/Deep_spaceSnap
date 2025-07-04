// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// This helper function MUST be defined outside the component.
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        console.log("Axios default token has been SET.");
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
        console.log("Axios default token has been REMOVED.");
    }
};

export const AuthProvider = ({ children }) => {
    // We get the token from localStorage only on the initial render.
    const [token, setToken] = useState(localStorage.getItem('spaceSnapToken'));
    const [user, setUser] = useState(undefined);
    const navigate = useNavigate();
    const location = useLocation();

    // This effect runs only when the component mounts or the token state changes.
    useEffect(() => {
        setAuthToken(token); // Set the header right away
        if (token) {
            localStorage.setItem('spaceSnapToken', token);
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    setToken(null);
                } else {
                    setUser(decoded.user);
                }
            } catch (error) {
                setToken(null);
            }
        } else {
            localStorage.removeItem('spaceSnapToken');
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            setToken(res.data.token);
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        } catch (err) {
            setToken(null);
            throw new Error(err.response?.data?.msg || 'Login failed.');
        }
    };

    const logout = () => {
        setToken(null);
        navigate('/login');
    };

    const updateUserToken = (newToken) => {
        setToken(newToken);
    };

    const value = { user, isAuthenticated: !!user, isLoading: user === undefined, login, logout, updateUserToken };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);