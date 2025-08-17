"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { BusinessService } from '@/lib/services/businessService';
import Footer from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import Image from 'next/image';

const PACKAGES = [
  { name: '50 pedidos', cost: 750, bonus: 15 },
  { name: '100 pedidos', cost: 1500, bonus: 25 },
  { name: '250 pedidos', cost: 3750, bonus: 35 },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [proof, setProof] = useState<File | null>(null);

  const handleStripe = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (!user) throw new Error('Usuario no autenticado');
      const { sessionUrl } = await BusinessService.purchaseCreditsWithCard(user.uid, PACKAGES[selected].name);
      window.location.href = sessionUrl;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar pago con tarjeta');
    } finally {
      setLoading(false);
    }
  };

  const handleManual = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    if (!proof) {
      setError('Debes subir el comprobante de pago.');
      setLoading(false);
      return;
    }
    try {
      if (!user) throw new Error('Usuario no autenticado');
      await BusinessService.requestManualCreditPurchase(user.uid, {
        packageName: PACKAGES[selected].name,
        packageCost: PACKAGES[selected].cost,
        proofOfPayment: proof,
      });
      setMessage('Solicitud enviada. Un administrador validará tu pago.');
      setProof(null);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white animate-fade-in">
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-3xl bg-white/90 rounded-xl shadow p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-befast-primary mb-6">Compra de Créditos</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`rounded-lg border p-6 flex flex-col items-center cursor-pointer transition-all group ${selected === i ? 'border-befast-primary shadow-lg scale-105' : 'border-gray-200 hover:border-befast-primary/60'}`}
                onClick={() => setSelected(i)}
                tabIndex={0}
                aria-pressed={selected === i}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelected(i)}
              >
                <div className="text-lg font-bold text-befast-primary mb-2">{pkg.name}</div>
                <div className="text-3xl font-mono text-befast-primary mb-2">${pkg.cost}</div>
                <div className="text-xs text-green-600">+{pkg.bonus} gratis en la primera compra</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Pago con tarjeta */}
            <div className="flex-1 bg-befast-primary/5 rounded-lg p-6 flex flex-col gap-4 animate-fade-in">
              <h2 className="font-bold text-befast-primary mb-2">Pago con Tarjeta</h2>
              <Button onClick={handleStripe} disabled={loading} className="w-full">
                {loading ? <Loading size="sm" /> : 'Pagar con Stripe'}
              </Button>
              <div className="text-xs text-gray-500">Acreditación automática e inmediata tras el pago.</div>
            </div>
            {/* Pago manual */}
            <form className="flex-1 bg-befast-secondary/5 rounded-lg p-6 flex flex-col gap-4 animate-fade-in" onSubmit={handleManual}>
              <h2 className="font-bold text-befast-secondary mb-2">Transferencia Bancaria</h2>
              <div className="text-sm">
                <div><b>Banco:</b> BBVA</div>
                <div><b>Cuenta:</b> 150 480 8078</div>
                <div><b>CLABE:</b> 012 098 01504808078 9</div>
              </div>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={e => setProof(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-befast-secondary/20 file:text-befast-secondary hover:file:bg-befast-secondary/40 transition"
                aria-label="Subir comprobante de pago"
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loading size="sm" /> : 'Enviar comprobante'}
              </Button>
              <div className="text-xs text-gray-500">Un administrador validará tu pago y acreditará los créditos.</div>
            </form>
          </div>
          {error && <div className="text-red-600 mt-4 animate-shake">{error}</div>}
          {message && <div className="text-green-600 mt-4 animate-fade-in">{message}</div>}
          <div className="mt-8 text-xs text-gray-500">
            Para solicitar factura, envía tu Constancia de Situación Fiscal y detalles de compra a <a href="mailto:documentos@befastapp.com.mx" className="underline text-befast-primary">documentos@befastapp.com.mx</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
