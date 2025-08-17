'use client';

import { useAuth } from './AuthProvider';
import { UserRole } from '@/lib/types';
import { Loading } from '@/components/ui/Loading';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Verificando permisos..." />;
  }

  const userRoles = Object.keys(user?.customClaims || {}).filter(key =>
    key === 'SUPER_ADMIN' || key === 'ADMIN' || key === 'CONTADORA' || key === 'BUSINESS' || key === 'DRIVER'
  ) as UserRole[];

  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

  if (!user || !hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-befast-error">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes los permisos necesarios para ver esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
