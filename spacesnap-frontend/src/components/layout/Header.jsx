// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAuth } from '../../context/AuthContext'; // Import our hook
import logo from '../../assets/images/logo.png'; // Import logo

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, login, logout } = useAuth(); // Get user state and functions
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navItems = [
    { id: 1, name: "Visualizer", path: "/visualizer" },
    { id: 2, name: "Style Quiz", path: "/style-quiz" },
    { id: 3, name: "AR Preview", path: "/ar-preview" },
  ];

  // Close dropdown if clicked outside
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
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-neutral-dark flex items-center gap-2">
          <img src={logo} alt="SpaceSnap Logo" className="h-8" />
          SpaceSnap
        </NavLink>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.id} to={item.path} className={({ isActive }) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? "text-primary-teal" : "text-neutral-dark hover:text-primary-teal"}`}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 cursor-pointer">
                <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <NavLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral-light">Dashboard</NavLink>
                  {user.role === 'admin' && <NavLink to="/admin-dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral-light">Admin Panel</NavLink>}
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-neutral-light">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* This is a mock login button for testing */}
              <button onClick={login} className="px-5 py-1.5 border border-primary-teal text-primary-teal rounded-full hover:bg-primary-teal hover:text-white transition">
                Login / Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="cursor-pointer text-primary-teal">
            {isMobileMenuOpen ? <IoMdClose size={28} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => <NavLink key={item.id} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-neutral-dark font-medium"> {item.name}</NavLink>)}
        </div>
      )}
    </header>
  );
};

export default Navbar;