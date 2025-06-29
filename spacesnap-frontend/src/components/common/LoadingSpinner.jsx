// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
  };
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-teal ${sizeClasses[size]} ${className}`}></div>
  );
};

export default LoadingSpinner;