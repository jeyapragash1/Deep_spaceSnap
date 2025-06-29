// src/components/ui/AlertMessage.jsx
import React from 'react';

const AlertMessage = ({ message, type = 'success' }) => {
  const baseClasses = 'p-4 mb-4 rounded-md text-sm';
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};

export default AlertMessage;