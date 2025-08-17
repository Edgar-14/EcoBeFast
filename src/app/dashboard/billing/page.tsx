'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { CREDIT_PACKAGES } from '@/lib/utils/constants';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonusCredits: number;
  description: string;
}

export default function BillingPage() {
  const [currentCredits, setCurrentCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePurchaseCredits = async (packageId: string) => {
    setLoading(true);
    try {
      // TODO: Implement credit purchase logic
      console.log('Purchasing package:', packageId);
    } catch (error) {
      console.error('Error purchasing credits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-befast-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-befast-text mb-2">
            Billing & Credits
          </h1>
          <p className="text-gray-600">
            Manage your delivery credits and billing information
          </p>
        </div>

        {/* Current Credits */}
        <Card className="mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Current Credits</h2>
            <div className="text-4xl font-bold text-befast-primary mb-2">
              {currentCredits}
            </div>
            <p className="text-gray-600">Available delivery credits</p>
          </div>
        </Card>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-befast-text mb-6">
            Purchase Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg: CreditPackage) => (
              <Card 
                key={pkg.id} 
                className="relative hover:shadow-lg transition-shadow"
                padding="lg"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-befast-primary mb-2">
                    ${pkg.price}
                  </div>
                  <div className="mb-4">
                    <span className="text-lg font-medium">{pkg.credits} credits</span>
                    {pkg.bonusCredits > 0 && (
                      <span className="text-sm text-befast-success block">
                        + {pkg.bonusCredits} bonus credits
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <button
                    onClick={() => handlePurchaseCredits(pkg.id)}
                    disabled={loading}
                    className="w-full bg-befast-primary text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <div className="text-center py-8 text-gray-500">
            No billing history available
          </div>
        </Card>
      </div>
    </div>
  );
}