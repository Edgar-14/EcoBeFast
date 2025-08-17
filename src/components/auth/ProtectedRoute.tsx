'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loading } from '@/components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to a generic login page or home
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading fullScreen text="Verificando sesión..." />;
  }

  if (!user) {
    return null; // Or a fallback component
  }

  return <>{children}</>;
};

export default ProtectedRoute;
