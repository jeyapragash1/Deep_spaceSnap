// src/components/layout/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center px-6">
        <p className="font-semibold text-lg mb-2">SpaceSnap</p>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} SpaceSnap by Group 10. All Rights Reserved.</p>
        <p className="text-sm text-gray-400">Uva Wellassa University of Sri Lanka</p>
      </div>
    </footer>
  );
};

export default Footer;