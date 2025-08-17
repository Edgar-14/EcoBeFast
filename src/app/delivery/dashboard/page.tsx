"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { BusinessService } from '@/lib/services/businessService';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    amountToCollect: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    BusinessService.getProfile(user.uid).then(setBusiness);
    BusinessService.getOrders(user.uid, 10).then(setOrders);
  }, [user]);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreateOrder = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!business || business.availableCredits < 1) {
      setError('No tienes créditos suficientes para crear un pedido.');
      return;
    }
    if (!form.customerName || !form.customerPhone || !form.address) {
      setError('Todos los campos obligatorios deben estar completos.');
      return;
    }
    if (!/^\d{10}$/.test(form.customerPhone)) {
      setError('El teléfono del cliente debe tener 10 dígitos.');
      return;
    }
    setOrderLoading(true);
    try {
      if (!user) throw new Error('Usuario no autenticado');
      await BusinessService.createOrder(business.uid, {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        deliveryAddress: form.address,
        deliveryCoordinates: { lat: 0, lng: 0 }, // TODO: Integrar coordenadas reales
        amountToCollect: parseFloat(form.amountToCollect) || 0,
        paymentMethod: "CASH",
        notes: form.notes,
      });
      setForm({ customerName: '', customerPhone: '', address: '', amountToCollect: '', notes: '' });
      BusinessService.getOrders(user.uid, 10).then(setOrders);
      BusinessService.getProfile(user.uid).then(setBusiness);
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
    } finally {
      setOrderLoading(false);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white">
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel de créditos y pedidos activos */}
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Image src="/befast-logo.png" alt="BeFast Logo" width={50} height={50} />
              <div>
                <div className="text-lg font-bold text-befast-primary">Créditos disponibles</div>
                <div className="text-3xl font-mono text-befast-primary">{business?.availableCredits ?? '...'}</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Pedidos activos</div>
              <ul className="divide-y divide-gray-200">
                {orders.length === 0 && <li className="text-gray-500 text-sm">No hay pedidos activos.</li>}
                {orders.map(order => (
                  <li key={order.id} className="py-2 flex flex-col">
                    <span className="font-medium">{order.deliveryInfo.customerName}</span>
                    <span className="text-xs text-gray-500">{order.deliveryInfo.address}</span>
                    <span className="text-xs text-befast-primary">Estado: {order.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Formulario de nuevo pedido */}
          <form onSubmit={handleCreateOrder} className="bg-white/90 rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-befast-primary mb-2">Nuevo Pedido</h2>
            <Input name="businessName" label="Negocio" value={business?.businessName || ''} readOnly />
            <Input name="address" label="Dirección de Recogida" value={business?.location?.address || ''} readOnly />
            <Input name="customerName" label="Nombre del Cliente" value={form.customerName} onChange={handleChange} required />
            <Input name="customerPhone" label="Teléfono del Cliente" value={form.customerPhone} onChange={handleChange} required pattern="\d{10}" maxLength={10} />
            <Input name="address" label="Dirección de Entrega" value={form.address} onChange={handleChange} required />
            <Input name="amountToCollect" label="Monto a Cobrar (opcional)" value={form.amountToCollect} onChange={handleChange} type="number" min="0" />
            <Input name="notes" label="Notas (opcional)" value={form.notes} onChange={handleChange} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" disabled={orderLoading} className="w-full">{orderLoading ? 'Creando...' : 'Crear Pedido'}</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
