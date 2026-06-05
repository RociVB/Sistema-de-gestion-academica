import React from 'react';

const DangerButton = ({ type = 'button', onClick, children, disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default DangerButton;
