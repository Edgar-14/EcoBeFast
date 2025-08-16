'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
  { name: 'Solicitudes de Repartidores', href: '/admin/driver-applications', icon: '📝' },
  { name: 'Flota de Repartidores', href: '/admin/drivers', icon: '🚚' },
  { name: 'Pedidos', href: '/admin/orders', icon: '📦' },
  { name: 'Negocios Afiliados', href: '/admin/businesses', icon: '🏢' },
  { name: 'Nómina y Cumplimiento', href: '/admin/payroll', icon: '💰' },
  { name: 'Incentivos', href: '/admin/incentives', icon: '🎉' },
  { name: 'Soporte', href: '/admin/support', icon: '🆘' },
  { name: 'Auditoría', href: '/admin/audit-log', icon: '🔍' },
  { name: 'Configuración', href: '/admin/settings', icon: '⚙️' },
];

const NavLink = ({ href, icon, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <span className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-befast-primary text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}>
        <span className="mr-3">{icon}</span>
        {children}
      </span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold text-befast-primary">BeFast Admin</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink key={link.name} href={link.href} icon={link.icon}>
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">© 2025 BeFast</p>
      </div>
    </div>
  );
};

export default Sidebar;
