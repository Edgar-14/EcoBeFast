import React from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      {/* Glass Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-white backdrop-blur-2xl z-0" />
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
