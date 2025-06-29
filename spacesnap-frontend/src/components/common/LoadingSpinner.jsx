// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${sizeClasses[size]}`}></div>
  );
};
export default LoadingSpinner;