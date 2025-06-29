// src/components/common/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary-teal text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-300 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;