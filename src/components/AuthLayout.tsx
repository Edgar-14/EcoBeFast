import React from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')" }}
      ></div>
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
