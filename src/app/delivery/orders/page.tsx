"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { BusinessService } from '@/lib/services/businessService';
import Footer from '@/components/ui/Footer';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    BusinessService.getOrders(user.uid, 50).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, [user]);

  const filteredOrders = orders.filter(order =>
    filter === '' || order.status === filter
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white animate-fade-in">
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-befast-primary mb-6 transition-colors">Historial de Pedidos</h1>
          <div className="flex gap-2 mb-4">
            <select
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-befast-primary transition"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="created">Creado</option>
              <option value="assigned">Asignado</option>
              <option value="on_the_way">En camino</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 rounded mb-2" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-gray-500 text-center">No hay pedidos para mostrar.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <li key={order.id} className="py-4 px-2 hover:bg-befast-primary/10 rounded transition group">
                  <Link href={`/delivery/orders/${order.id}`} className="flex flex-col md:flex-row md:items-center gap-2 focus:outline-none focus:ring-2 focus:ring-befast-primary">
                    <span className="font-semibold text-befast-primary group-hover:underline transition">{order.deliveryInfo.customerName}</span>
                    <span className="text-xs text-gray-500 flex-1">{order.deliveryInfo.location?.address}</span>
                    <span className="text-xs px-2 py-1 rounded bg-befast-primary/10 text-befast-primary font-mono transition">{order.status}</span>
                    <span className="text-xs text-gray-400">{new Date(order.orderDate?.seconds * 1000).toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
