'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import TertiaryButton from '@/components/ui/TertiaryButton';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      {/* Glass Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-white z-0" />
      {/* Content */}
      <div className="relative z-10">
        <Card className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold title-gradient mb-2">Bienvenido a BeFast</h1>
          <p className="text-gray-600 mb-8">Tu plataforma de entregas, todo en un solo lugar.</p>

          <div className="space-y-4 flex flex-col items-center">
            <a
              href="https://order.befastmarket.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <PrimaryButton className="w-full">
                BeFast Market
              </PrimaryButton>
            </a>

            <Link href="/delivery/login" className="w-full">
              <SecondaryButton className="w-full">
                BeFast Delivery
              </SecondaryButton>
            </Link>

            <Link href="/drivers/login" className="w-full">
              <TertiaryButton className="w-full">
                BeFast Repartidores
              </TertiaryButton>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
