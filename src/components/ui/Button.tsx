'use client';

import React from 'react';

interface ConnectButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ConnectButtonProps> = ({ label, onClick }) => {
  return (
    <div className="bnrbtn transition-all duration-300 relative ease-in-out transform hover:scale-105">
      <button
        className="w-auto cursor-pointer flex justify-center p-3 relative border-white rounded-lg bg-gradient-to-b from-[#bc9b54] to-[#b79249] hover:from-[#e5a526] hover:to-custom-dark-end"
        type="button"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
