"use client";


import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BusinessService } from '@/lib/services/businessService';
import { OrderBusinessActionsService } from '@/lib/services/orderBusinessActionsService';
import { useAuth } from '@/components/auth/AuthProvider';
import { Order } from '@/lib/types';

function NewOrderForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCoordinates: { lat: 0, lng: 0 },
    amountToCollect: 0,
  paymentMethod: 'CASH' as 'CASH' | 'CARD',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'paymentMethod') {
      setForm(f => ({ ...f, paymentMethod: value as 'CASH' | 'CARD' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await BusinessService.createOrder(user?.uid!, form);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Nueva Orden</h2>
      <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Nombre del cliente" className="border p-2 w-full" required />
      <input name="customerPhone" value={form.customerPhone} onChange={handleChange} placeholder="Teléfono" className="border p-2 w-full" required />
      <input name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="Dirección de entrega" className="border p-2 w-full" required />
      <input name="amountToCollect" type="number" value={form.amountToCollect} onChange={handleChange} placeholder="Monto a cobrar" className="border p-2 w-full" required />
      <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="border p-2 w-full">
        <option value="CASH">Efectivo</option>
        <option value="CARD">Tarjeta</option>
      </select>
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notas (opcional)" className="border p-2 w-full" />
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</Button>
        <Button type="button" onClick={onCancel} variant="secondary">Cancelar</Button>
      </div>
    </form>
  );
}

export default function BusinessOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await BusinessService.getOrders(user?.uid!);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchOrders();
  }, [user?.uid]);

  const handleCancelRequest = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await OrderBusinessActionsService.requestCancelOrder(orderId, user?.uid!);
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Órdenes</h1>
      <Button onClick={() => setShowForm(true)} className="mb-4">+ Nueva Orden</Button>
      {showForm && (
        <NewOrderForm onCreated={() => { setShowForm(false); fetchOrders(); }} onCancel={() => setShowForm(false)} />
      )}
      {loading ? (
        <div>Cargando órdenes...</div>
      ) : (
        <Card>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
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
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">${order.deliveryInfo?.amountToCollect ?? 0}</td>
                  <td className="px-4 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                  <td className="px-4 py-2">
                    {(order.status === 'created' || order.status === 'assigned') && (
                      <Button size="sm" variant="danger" disabled={!!actionLoading} onClick={() => handleCancelRequest(order.id)}>
                        {actionLoading === order.id ? 'Solicitando...' : 'Solicitar Cancelación'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
