// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom"; // Add Link
import { FaBars, FaLightbulb } from "react-icons/fa"; // Using the guaranteed icon
import { IoMdClose } from "react-icons/io";
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.jpg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // No longer need 'login' here
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Visualizer", path: "/visualizer" },
    { name: "Style Quiz", path: "/style-quiz" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    logout(); // This will clear the token and user state, then redirect
    setIsDropdownOpen(false);
  };
  
  const getDashboardPath = () => {
    // This function can now be simplified
    return "/dashboard";
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <img src={logo} alt="SpaceSnap Logo" className="h-8" />
          SpaceSnap
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={({ isActive }) => `px-3 py-2 rounded-md font-medium transition-colors ${isActive ? "text-primary-teal" : "text-gray-700 hover:text-primary-teal"}`}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img src={user.avatar || 'https://source.unsplash.com/150x150/?portrait'} alt="User Avatar" className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-primary-teal" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border py-1 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    </div>
                    <Link to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              // --- THIS IS THE FIX ---
              // This button is now a Link that navigates to the /login page
              <Link to="/login" className="px-5 py-2 border border-primary-teal text-primary-teal rounded-full font-semibold hover:bg-primary-teal hover:text-white transition-colors duration-300">
                Login / Register
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <IoMdClose size={28} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Code (remains the same) */}
    </header>
  );
};

export default Navbar;