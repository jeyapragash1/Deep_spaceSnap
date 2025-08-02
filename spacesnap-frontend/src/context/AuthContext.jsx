// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// --- THIS IS THE FIX: Use our single, configured axios instance for all calls ---
import api from '../api/axiosConfig'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("spaceSnapToken"));
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      localStorage.setItem("spaceSnapToken", token);
      if (!user) {
        profile().catch(() => {
          // If fetching profile fails (e.g., bad token), log the user out.
          setToken(null);
        });
      }
    } else {
      localStorage.removeItem("spaceSnapToken");
      setUser(null);
    }
  }, [token]);

  const profile = async () => {
    try {
      // Use our 'api' instance which automatically sends the token
      const res = await api.get("/users/profile");
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Profile fetch failed:", error);
      // This will be caught by the useEffect to log the user out.
      throw new Error(error.response?.data?.msg || "Failed to fetch profile.");
    }
  };

  const login = async (email, password) => {
    try {
      // Use 'api' for the login request
      const res = await api.post("/users/login", { email, password });
      
      setToken(res.data.accessToken); 
      setUser(res.data.user);
      
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setToken(null);
      throw new Error(err.response?.data?.msg || "Login failed.");
    }
  };

  const loginWithGoogle = async (credential, role) => {
    try {
      // Use 'api' for the Google login request
      const res = await api.post("/users/auth/google", { credential, role });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setToken(null);
      throw new Error(
        JSON.stringify(err.response?.data || { msg: "Google login failed.", email: "" })
      );
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.error("Server-side logout failed:", err);
    } finally {
      setToken(null);
      setUser(null); 
      navigate("/login");
    }
  };

  const updateUserToken = (newToken) => {
    setToken(newToken);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    login,
    logout,
    updateUserToken,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);