// src/components/layout/MainLayout.jsx

import React from 'react';
import Header from './Header';
import Footer from './Footer';

// Receive the login state and pass it ONLY to the Header
const MainLayout = ({ children, isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;