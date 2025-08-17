import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loading } from '@/components/ui/Loading';

interface AdminRouteProps {
  children: React.ReactNode;
}


import { CustomClaims } from '@/lib/types/auth';
const allowedRoles: (keyof CustomClaims)[] = ['SUPER_ADMIN', 'ADMIN', 'CONTADORA'];

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (
      !loading &&
      (!user ||
        !user.customClaims ||
        !allowedRoles.some(r => Boolean(user.customClaims && user.customClaims[r])))
    ) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading fullScreen text="Verificando permisos..." />;
  }

  if (
    !user ||
    !user.customClaims ||
    !allowedRoles.some(r => Boolean(user.customClaims && user.customClaims[r]))
  ) {
    return null;
  }

  return <>{children}</>;
};
export default AdminRoute;
