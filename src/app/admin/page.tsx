import AdminRoute from '@/components/auth/AdminRoute';

export default function AdminRootPage({ children }: { children: React.ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}
