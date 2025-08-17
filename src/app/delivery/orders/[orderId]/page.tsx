"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessService } from '@/lib/services/businessService';
import Footer from '@/components/ui/Footer';
import { Loading } from '@/components/ui/Loading';
import { OrderTimeline } from '@/components/ui/OrderTimeline';
import { OrderMap } from '@/components/ui/OrderMap';

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BusinessService.getOrder(params.orderId).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [params.orderId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  }
  if (!order) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Pedido no encontrado</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white animate-fade-in">
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-2xl bg-white/90 rounded-xl shadow p-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-befast-primary mb-4 transition-colors">Detalle del Pedido</h1>
          <div className="mb-4">
            <span className="font-semibold">Cliente:</span> {order.deliveryInfo.customerName}<br />
            <span className="font-semibold">Teléfono:</span> {order.deliveryInfo.customerPhone}<br />
            <span className="font-semibold">Dirección de Entrega:</span> {order.deliveryInfo.location?.address}<br />
            <span className="font-semibold">Monto a Cobrar:</span> ${order.deliveryInfo.amountToCollect?.toFixed(2)}<br />
            <span className="font-semibold">Notas:</span> {order.deliveryInfo.notes || '-'}<br />
            <span className="font-semibold">Estado:</span> <span className="px-2 py-1 rounded bg-befast-primary/10 text-befast-primary font-mono transition">{order.status}</span>
          </div>
          <OrderTimeline events={order.timeline || []} />
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Seguimiento en tiempo real</h2>
            <OrderMap coordinates={order.deliveryInfo.location?.coordinates} shipday={order.shipday} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
