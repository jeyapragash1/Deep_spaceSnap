// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      const res = await api.get("/users/profile");
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.msg || "Failed to fetch profile.");
    }
  };

  const login = async (email, password) => {
    try {
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
      console.error("Logout failed but proceeding:", err);
    } finally {
      setToken(null);
      setUser(null); 
      navigate("/login");
    }
  };

  // --- THIS IS THE KEY FUNCTION ---
  // A dedicated function to update the user state from other components
  const updateUserState = (newUserData) => {
    setUser(newUserData);
  };


  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    login,
    logout,
    updateUserState, // <-- Expose the function to the rest of the app
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);