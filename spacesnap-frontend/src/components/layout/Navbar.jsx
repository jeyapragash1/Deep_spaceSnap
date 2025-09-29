// src/components/layout/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaLock } from "react-icons/fa"; // Import FaLock
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.jpg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- THIS IS THE KEY LOGIC ---
  // A simple boolean to check if the user is premium or higher
  const isPremiumOrHigher = user?.subscription === 'premium' || user?.role === 'designer' || user?.role === 'admin';

  // --- MODIFIED NAV ITEMS ---
  // We add an 'isLocked' property to the premium features
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Style Quiz", path: "/style-quiz" },
    { name: "Room Visualizer", path: "/visualizer", isLocked: !isPremiumOrHigher },
    { name: "Room Preview", path: "/ar-preview", isLocked: !isPremiumOrHigher },
  ];
  // --- END OF MODIFICATION ---

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };
  
  // --- NEW COMPONENT FOR CONDITIONAL LINKS ---
  const ConditionalNavLink = ({ item, isMobile = false }) => {
    const baseClass = isMobile ? "block px-3 py-2 rounded-md text-base font-medium" : "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    
    const activeClass = "bg-primary-teal text-white";
    const inactiveClass = "text-gray-600 hover:text-primary-teal hover:bg-gray-100";
    
    if (item.isLocked && isAuthenticated) {
      // If the item is locked and user is logged in, link to upgrade
      return (
        <Link 
          to="/upgrade" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          className={`${baseClass} ${inactiveClass} flex items-center justify-between`}
        >
          <span>{item.name}</span>
          <FaLock className="text-yellow-500" size={12} />
        </Link>
      );
    }

    if (item.isLocked && !isAuthenticated) {
      // If item is locked and user is NOT logged in, link to login
      return (
        <Link 
          to="/login" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          className={`${baseClass} ${inactiveClass} flex items-center justify-between`}
        >
          <span>{item.name}</span>
          <FaLock className="text-yellow-500" size={12} />
        </Link>
      );
    }
    
    // Default NavLink for public or unlocked items
    return (
      <NavLink 
        to={item.path}
        end={item.path === "/"}
        onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        {item.name}
      </NavLink>
    );
  };
  // --- END OF NEW COMPONENT ---
  
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img src={logo} alt="SpaceSnap Logo" className="h-9" />
          <span className="text-xl font-bold text-neutral-dark">SpaceSnap</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {navItems.map((item) => (
            <ConditionalNavLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center focus:outline-none">
                  <img src={user?.avatar || 'https://source.unsplash.com/150x150/?portrait'} alt="User Avatar" className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-primary-teal" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border py-1 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b"><p className="text-sm font-semibold text-gray-800">Signed in as</p><p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p></div>
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2 border border-primary-teal text-primary-teal rounded-full font-semibold hover:bg-primary-teal hover:text-white transition-colors duration-300">
                Login / Register
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <ConditionalNavLink key={item.name} item={item} isMobile={true} />
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">My Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100">Sign out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary-teal hover:bg-gray-100">Login / Register</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;