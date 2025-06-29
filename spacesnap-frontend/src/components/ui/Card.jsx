// src/components/ui/Card.jsx
import React from 'react';

// A simple, reusable Card component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;