'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loading } from '@/components/ui/Loading';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    }
  }, [loading, router]);

  return <Loading fullScreen text="Redirigiendo..." />;
}
