import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl border border-blue-100 shadow-2xl p-8 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:ring-2 hover:ring-blue-200 ${className}`}
      style={{filter:'drop-shadow(0 4px 24px rgba(31,38,135,0.10))'}}
    >
      {children}
    </div>
  );
};

export default Card;
