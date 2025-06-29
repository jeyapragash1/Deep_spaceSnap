// src/components/common/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled, className, variant = 'primary' }) => {
  const baseStyles = 'px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-teal text-white hover:bg-opacity-90',
    outline: 'bg-transparent border border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white',
    secondary: 'bg-accent-gold text-white hover:bg-opacity-90',
  };
  const buttonClass = `${baseStyles} ${variants[variant]} ${className}`;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClass}>
      {children}
    </button>
  );
};
export default Button;