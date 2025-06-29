import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.jpg'; // <-- FIXED
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Visualizer", path: "/visualizer" },
    { name: "Style Quiz", path: "/style-quiz" },
    { name: "AR Preview", path: "/ar-preview" },
  ];

  // Close dropdown if clicking outside of it
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

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case 'admin': return "/admin-dashboard";
      case 'designer': return "/designer-dashboard";
      default: return "/dashboard";
    }
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
            <NavLink key={item.name} to={item.path} className={({ isActive }) => `px-3 py-2 rounded-md font-medium transition-colors ${isActive ? "text-teal-600" : "text-gray-700 hover:text-teal-600"}`}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img src={user.avatar} alt="User Avatar" className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-teal-500" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border py-1 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    </div>
                    <NavLink to={getDashboardPath()} onClick={() => setIsDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</NavLink>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={login} className="px-5 py-2 border border-teal-600 text-teal-600 rounded-full font-semibold hover:bg-teal-600 hover:text-white transition-colors duration-300">
                Login / Register
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <IoMdClose size={28} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;