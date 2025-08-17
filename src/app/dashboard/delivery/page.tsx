"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function BusinessDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Aquí podrías cargar datos de órdenes, créditos, etc.

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel de Negocio</h1>
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Bienvenido, {user?.displayName || user?.email}</h2>
            <p className="text-gray-600">Aquí puedes gestionar tus órdenes, créditos y facturación.</p>
          </div>
          <Button onClick={() => router.push('/dashboard/delivery/orders')}>Ver Órdenes</Button>
        </div>
      </Card>
      {/* Aquí puedes agregar más widgets: resumen de créditos, facturación, etc. */}
    </div>
  );
}
