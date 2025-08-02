// src/api/axiosConfig.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This interceptor automatically adds the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage using the key your AuthContext sets
    const token = localStorage.getItem('spaceSnapToken'); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;