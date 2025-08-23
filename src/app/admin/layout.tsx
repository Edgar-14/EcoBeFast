'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Solicitudes de Repartidores', href: '/admin/driver-applications' },
  { label: 'Repartidores', href: '/admin/drivers' },
  { label: 'Pedidos', href: '/admin/orders' },
  { label: 'Negocios', href: '/admin/businesses' },
  { label: 'Nómina', href: '/admin/payroll' },
  { label: 'Incentivos', href: '/admin/incentives' },
  { label: 'Soporte', href: '/admin/support' },
  { label: 'Auditoría', href: '/admin/audit-log' },
  { label: 'Configuración', href: '/admin/settings' },
  { label: 'Administradores', href: '/admin/admin-management' },
  { label: 'Sync Shipday', href: '/admin/manual-sync' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">BeFast Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          {adminNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded hover:bg-befast-primary/10 transition font-medium ${pathname === item.href ? 'bg-befast-primary/20 text-befast-primary' : 'text-gray-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
