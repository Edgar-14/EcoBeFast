"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';
import { exportToExcel } from '@/lib/utils/exportToExcel';
import Link from 'next/link';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'created', label: 'Creado' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'at_pickup', label: 'En Recogida' },
  { value: 'picked_up', label: 'Recogido' },
  { value: 'at_dropoff', label: 'En Entrega' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'failed', label: 'Fallido' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getOrders(status ? { status } : undefined);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: orders,
        filename: 'pedidos.xlsx',
        sheetName: 'Pedidos',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>
      <Card>
        {loading ? (
          <div className="p-4">Cargando...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Negocio</th>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.businessName}</td>
                  <td className="px-4 py-2">{order.deliveryInfo?.customerName}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">${order.deliveryInfo?.amountToCollect ?? 0}</td>
                  <td className="px-4 py-2">{order.createdAt ? new Date(order.createdAt.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleString() : ''}</td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/orders/${order.id}`} className="text-befast-primary hover:underline">Ver Detalle</Link>
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
