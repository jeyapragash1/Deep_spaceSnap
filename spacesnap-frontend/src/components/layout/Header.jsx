// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from '../common/Button'; // Ensure this path is correct

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const guestLinks = [
    { name: 'Features', path: '/features' },   // This link now has a route
    { name: 'Portfolio', path: '/portfolio' }, // This link has a route
    { name: 'About Us', path: '/about' },       // This link now has a route
  ];

  const userLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const linksToRender = isLoggedIn ? userLinks : guestLinks;

  // ... rest of the component code remains the same ...
  // (The full code is not needed here, just confirming the links array)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-primary-teal">
          SpaceSnap
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {linksToRender.map((link) => (
            <Link key={link.name} to={link.path} className="text-gray-600 hover:text-primary-teal transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-2">
          {isLoggedIn ? (
            <Button onClick={() => setIsLoggedIn(false)} variant="primary">Log Out</Button>
          ) : (
            <>
              <Link to="/login"><Button variant="outline">Log In</Button></Link>
              <Link to="/signup"><Button variant="secondary">Sign Up</Button></Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4">
          <div className="flex flex-col space-y-4">
            {linksToRender.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 hover:text-primary-teal" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <hr/>
            {isLoggedIn ? (
              <Button onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }} variant="primary">Log Out</Button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full">Log In</Button></Link>
                <Link to="/signup" onClick={() => setIsMenu-Open(false)}><Button variant="secondary" className="w-full">Sign Up</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;