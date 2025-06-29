// src/App.jsx
import React, { useState, useEffect } from 'react';
import AppRoutes from './routes';

function App() {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // This useEffect hook runs only once when the app first loads
  useEffect(() => {
    // Check if an auth token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, we consider the user logged in
      setIsLoggedIn(true);
    }
    // Finished checking, so we can stop showing a loading screen
    setIsLoading(false);
  }, []); // The empty array [] means this effect runs only on mount

  // This function will be passed down to allow components to log the user out
  const handleSetIsLoggedIn = (status) => {
    setIsLoggedIn(status);
    if (!status) {
      // If logging out, remove the token and user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  // While we are checking for the token, we can show a simple loading message
  // This prevents a "flash" of the login screen before redirecting to the dashboard
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      {/* Pass the state AND the function to update it */}
      <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={handleSetIsLoggedIn} />
    </div>
  );
}

export default App;