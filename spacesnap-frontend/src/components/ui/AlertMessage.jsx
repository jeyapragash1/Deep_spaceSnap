// src/components/ui/AlertMessage.jsx
import React from 'react';

const AlertMessage = ({ message, type = 'error' }) => {
  const baseClasses = 'p-4 mb-4 text-sm rounded-lg';
  const typeClasses = {
    error: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
  };
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}!</span> {message}
    </div>
  );
};
export default AlertMessage;