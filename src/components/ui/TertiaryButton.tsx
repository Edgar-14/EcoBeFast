import React from 'react';

type TertiaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const TertiaryButton: React.FC<TertiaryButtonProps> = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
  className={`relative overflow-hidden font-bold py-3 px-6 rounded-lg shadow-lg text-white bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-[length:200%_200%] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{backgroundPosition: 'left'}}
    >
      <span className="relative z-10 drop-shadow-lg">{children}</span>
      {/* Efecto de brillo animado */}
      <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-500 blur-lg animate-shine" />
    </button>
  );
};

export default TertiaryButton;
