// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("spaceSnapToken"));
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      localStorage.setItem("spaceSnapToken", token);
      setAuthToken(token);
      if (!user) profile(); // Only fetch profile if user is not already set
    } else {
      localStorage.removeItem("spaceSnapToken");
      setAuthToken(null);
      setUser(null);
    }
  }, [token]);

  const profile = async () => {
    if (!token) throw new Error("Not authenticated");
    try {
      const res = await axios.get("http://localhost:5000/api/users/profile");
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.msg || "Failed to fetch profile.");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setToken(null);
      throw new Error(err.response?.data?.msg || "Login failed.");
    }
  };

  const loginWithGoogle = async (token, role) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/auth/google",
        { credential: token, role }
      );
      setToken(res.data.accessToken);
      setUser(res.data.user);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setToken(null);
      throw new Error(
        JSON.stringify(
          err.response?.data || {
            msg: "Google login failed. Please try again.",
            email: "",
          }
        )
      );
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/logout");
      if (res.status === 200) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("spaceSnapToken");
      }
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Logout failed.");
    }
    navigate("/login");
  };

  // This function is critical for the upgrade flow
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
