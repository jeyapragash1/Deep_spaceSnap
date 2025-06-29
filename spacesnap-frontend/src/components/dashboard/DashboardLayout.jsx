// src/components/dashboard/DashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate, Outlet } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear tokens here
    setIsLoggedIn(false); // Update the global state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex h-screen bg-neutral-light">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;