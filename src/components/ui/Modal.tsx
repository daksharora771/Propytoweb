'use client';

import { ReactNode, useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  preventBackdropClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  preventBackdropClose = false
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);
  
  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      // Add a delay to allow for a smooth animation
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!showModal) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  
  const handleBackdropClick = () => {
    if (!preventBackdropClose) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div 
        className={`bg-gray-900 border border-gray-800 rounded-xl p-0 shadow-2xl w-full mx-4 overflow-hidden transition-all duration-300 ${
          sizeClasses[size]
        } ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          
          {!preventBackdropClose && (
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <XCircle className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 