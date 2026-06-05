import React from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-all duration-300" onClick={onClose}></div>
      
      {/* Modal Box */}
      <div className="relative w-full max-w-lg mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t-2xl">
            <h3 className="text-xl font-semibold text-slate-800">
              {title}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-slate-400 hover:text-slate-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
              onClick={onClose}
            >
              <MdClose size={24} />
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
