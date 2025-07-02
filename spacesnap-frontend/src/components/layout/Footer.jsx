// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Use the correct path to your logo that we already fixed
import logo from '../../assets/images/logo.jpg'; 

// Use the correct imports for the icons
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    // This className uses the 'neutral-dark' color we defined in tailwind.config.js
    <footer className="bg-[#33271E] text-white p-8 mt-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <Link to="/" className="text-xl font-bold text-white flex items-center mb-4">
            {/* The 'filter invert' class makes a dark logo appear white on a dark background */}
            <img src={logo} alt="SpaceSnap Logo" className="h-8 mr-2 filter invert" />
            SpaceSnap
          </Link>
          <p className="text-gray-400 text-sm">Design Your Space in a Snap!</p>
          <p className="text-gray-500 text-xs mt-2">Empowering your design journey with AI & AR.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>      
            <li className="mb-2"><Link to="/style-quiz" className="text-gray-400 hover:text-white transition-colors">Style Quiz</Link></li>
            <li className="mb-2"><Link to="/visualizer" className="text-gray-400 hover:text-white transition-colors">Room Visualizer</Link></li>
            <li className="mb-2"><Link to="/ar-preview" className="text-gray-400 hover:text-white transition-colors">AR Preview</Link></li>
            <li className="mb-2"><Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul>
            <li className="mb-2"><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            <li className="mb-2"><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            <li className="mb-2"><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li className="mb-2"><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl">
              <FaInstagram />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl">
              <FaPinterestP />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl">
              <FaLinkedinIn />
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-4">Uva Wellassa University, Sri Lanka</p>
          <p className="text-gray-500 text-sm">contact@spacesnap.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 pt-4 border-t border-gray-700 text-xs">
        © {new Date().getFullYear()} SpaceSnap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;