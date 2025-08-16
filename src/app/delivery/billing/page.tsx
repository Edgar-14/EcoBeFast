'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

const creditPackages = [
  { name: '50 pedidos', price: 750, bonus: '15 gratis en la primera compra' },
  { name: '100 pedidos', price: 1500, bonus: '25 adicionales en la primera compra' },
  { name: '250 pedidos', price: 3750, bonus: '35 adicionales en la primera compra' },
];

export default function BillingPage() {
  const [manualPaymentFile, setManualPaymentFile] = useState(null);

  const handleStripeCheckout = (packageName) => {
    alert(`Iniciando checkout de Stripe para ${packageName}... (simulación)`);
  };

  const handleManualPaymentUpload = (e) => {
    setManualPaymentFile(e.target.files[0]);
  };

  const handleManualPaymentSubmit = (e) => {
    e.preventDefault();
    if (!manualPaymentFile) {
      alert("Por favor, sube tu comprobante de pago.");
      return;
    }
    alert(`Enviando comprobante "${manualPaymentFile.name}" para validación... (simulación)`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-befast-text mb-6">Facturación y Compra de Créditos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Credit Packages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-befast-text">Paquetes de Créditos</h2>
          {creditPackages.map((pkg) => (
            <Card key={pkg.name} className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <p className="text-xl font-semibold">{pkg.name}</p>
                <p className="text-gray-500">${pkg.price.toLocaleString()} MXN</p>
                <p className="text-sm text-befast-success">{pkg.bonus}</p>
              </div>
              <PrimaryButton onClick={() => handleStripeCheckout(pkg.name)} className="mt-4 sm:mt-0">
                Pagar con Tarjeta
              </PrimaryButton>
            </Card>
          ))}
        </div>

        {/* Manual Payment */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-befast-text">Pago Manual (Transferencia)</h2>
          <Card>
            <p className="font-semibold mb-2">Datos para la transferencia:</p>
            <ul className="list-disc list-inside text-gray-700 bg-gray-50 p-4 rounded-md">
              <li><span className="font-semibold">Banco:</span> BBVA</li>
              <li><span className="font-semibold">Cuenta:</span> 150 480 8078</li>
              <li><span className="font-semibold">CLABE:</span> 012 098 01504808078 9</li>
            </ul>
            <form onSubmit={handleManualPaymentSubmit} className="mt-6 space-y-4">
              <p className="text-sm">Una vez realizada la transferencia, sube tu comprobante aquí para que acreditemos tus créditos.</p>
              <div>
                <label htmlFor="proofOfPayment" className="block text-sm font-medium text-gray-700">Comprobante de pago</label>
                <input
                  type="file"
                  id="proofOfPayment"
                  onChange={handleManualPaymentUpload}
                  required
                  accept="image/jpeg,image/png,application/pdf"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-befast-secondary file:text-white hover:file:bg-befast-primary"
                />
              </div>
              <PrimaryButton type="submit" className="w-full">
                Enviar Comprobante para Validación
              </PrimaryButton>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
