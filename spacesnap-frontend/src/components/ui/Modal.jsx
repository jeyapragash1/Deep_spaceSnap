// src/components/ui/Modal.jsx

import React from 'react';
import Button from './Button';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 text-gray-600">
          {children}
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <Button onClick={onClose} variant="ghost">
            No, Go Back
          </Button>
          <Button onClick={onConfirm} variant="primary">
            Yes, Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;