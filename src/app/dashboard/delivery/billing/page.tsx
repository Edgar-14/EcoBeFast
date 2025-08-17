"use client";

import { Card } from '@/components/ui/Card';
import { CREDIT_PACKAGES } from '@/lib/utils/constants';

export default function BusinessBillingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Facturación y Créditos</h1>
      <Card>
        <h2 className="text-lg font-semibold mb-2">Paquetes de Créditos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_PACKAGES.map(pkg => (
            <div key={pkg.id} className="border rounded p-4 flex flex-col items-start">
              <div className="font-bold text-xl mb-1">{pkg.name}</div>
              <div className="text-gray-600 mb-2">{pkg.description}</div>
              <div className="mb-2">Créditos: <span className="font-semibold">{pkg.credits}</span></div>
              <div className="mb-2">Bono: <span className="text-green-600 font-semibold">+{pkg.bonusCredits}</span></div>
              <div className="mb-4 text-lg font-bold">${pkg.price} MXN</div>
              <button className="bg-befast-primary text-white px-4 py-2 rounded hover:bg-befast-primary-dark">Comprar</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
