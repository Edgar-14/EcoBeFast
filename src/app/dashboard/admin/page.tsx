"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';

export default function AdminDashboardPage() {
  const [pendingCancelOrders, setPendingCancelOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Buscar órdenes con cancelRequested === true
        const allOrders = await AdminService.getOrders();
        setPendingCancelOrders(allOrders.filter((o: any) => o.cancelRequested));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>
      <Card>
        <h2 className="text-lg font-semibold mb-2">Solicitudes de Cancelación de Órdenes</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : pendingCancelOrders.length === 0 ? (
          <div>No hay solicitudes pendientes.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID Orden</th>
                <th className="px-4 py-2 text-left">Negocio</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Motivo</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingCancelOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.businessId}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.cancelRequestReason || '-'}</td>
                  <td className="px-4 py-2">
                    {/* Aquí se puede agregar acción para cancelar realmente la orden */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
