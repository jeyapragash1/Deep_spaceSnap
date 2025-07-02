// src/components/layout/AuthLayout.jsx
import React from 'react';

// This layout is for pages that should NOT have a Navbar or Footer,
// like the Login and Register pages.
const AuthLayout = ({ children }) => {
    return (
        <main className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
            {/* The children prop will be our animated Login/Register form */}
            {children}
        </main>
    );
};

export default AuthLayout;