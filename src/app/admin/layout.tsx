
'use client';
import Sidebar from '@/components/admin/Sidebar';
import React from 'react';
import { usePathname } from 'next/navigation';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Oculta el sidebar en la página de login
  const isLogin = pathname === '/admin/login';
  if (isLogin) {
    return <>{children}</>;
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
