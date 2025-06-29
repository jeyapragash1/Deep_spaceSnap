// src/components/common/InputField.jsx
import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, required, icon }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-teal focus:border-primary-teal focus:outline-none ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
};
export default InputField;