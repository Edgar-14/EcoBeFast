import React from 'react';

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      className={`bg-gradient-to-r from-befast-primary to-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
