import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          bgColor: 'bg-green-600',
          iconColor: 'text-green-100',
          borderColor: 'border-green-500'
        };
      case 'error':
        return {
          icon: FaTimesCircle,
          bgColor: 'bg-red-600',
          iconColor: 'text-red-100',
          borderColor: 'border-red-500'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-orange-600',
          iconColor: 'text-orange-100',
          borderColor: 'border-orange-500'
        };
      default: // info
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-blue-600',
          iconColor: 'text-blue-100',
          borderColor: 'border-blue-500'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-6 right-6 z-50 max-w-sm"
        >
          <div className={`${config.bgColor} text-white p-4 rounded-lg shadow-2xl border-l-4 ${config.borderColor} backdrop-blur-sm`}>
            <div className="flex items-start">
              <IconComponent className={`${config.iconColor} text-xl mr-3 mt-0.5 flex-shrink-0`} />
              <div className="flex-1 mr-2">
                <p className="text-sm font-medium leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 flex-shrink-0"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;