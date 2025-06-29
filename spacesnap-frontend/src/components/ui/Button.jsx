// src/components/ui/Button.jsx

import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  // Define styles for different button variants
  const baseStyles = 'px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-green-600 hover:bg-green-700',
    ghost: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  const buttonClass = `${baseStyles} ${variants[variant]}`;

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;