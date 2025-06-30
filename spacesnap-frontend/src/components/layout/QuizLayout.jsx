// src/components/layout/QuizLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg'; // Make sure this path is correct

const QuizLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light">
      {/* Minimal Header */}
      <header className="p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-neutral-dark flex items-center gap-2">
            <img src={logo} alt="SpaceSnap Logo" className="h-8" />
            <span>SpaceSnap</span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-neutral-dark">← Exit Quiz</Link>
        </div>
      </header>
      
      {/* Main content area that grows to fill the space */}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="p-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SpaceSnap. All rights reserved.
      </footer>
    </div>
  );
};

export default QuizLayout;