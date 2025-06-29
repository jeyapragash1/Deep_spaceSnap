// src/components/common/InputField.jsx
import React from 'react';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-teal focus:border-primary-teal"
      />
    </div>
  );
};

export default InputField;