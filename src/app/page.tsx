'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')" }}
      ></div>
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>

      {/* Content */}
      <div className="relative z-20">
        <Card className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-befast-text mb-2">Bienvenido a BeFast</h1>
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
              <PrimaryButton className="w-full">
                BeFast Delivery
              </PrimaryButton>
            </Link>

            <Link href="/drivers/login" className="w-full">
              <PrimaryButton className="w-full">
                BeFast Repartidores
              </PrimaryButton>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
