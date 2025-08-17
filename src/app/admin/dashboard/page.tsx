"use client";
import { Card } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Centro de Control Operativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>Solicitudes Pendientes</Card>
        <Card>Repartidores Activos</Card>
        <Card>Pedidos del Día</Card>
      </div>
      {/* Aquí irán los gráficos y alertas en tiempo real */}
    </div>
  );
}
