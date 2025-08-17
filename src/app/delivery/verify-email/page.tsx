"use client";
import Footer from '@/components/ui/Footer';
import Image from 'next/image';

export default function DeliveryVerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white">
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/90 p-8 rounded-xl shadow max-w-md w-full flex flex-col items-center gap-4">
          <Image src="/befast-logo.png" alt="BeFast Logo" width={80} height={80} className="mb-2" />
          <h1 className="text-2xl font-bold text-befast-primary mb-2">Verifica tu correo electrónico</h1>
          <p className="text-gray-700 text-center">Te hemos enviado un enlace de verificación a tu correo electrónico.<br />
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.</p>
          <p className="text-sm text-gray-500 mt-2">¿No recibiste el correo? Revisa tu carpeta de spam o solicita un nuevo enlace desde la pantalla de login.</p>
          <a href="/delivery/login" className="text-befast-primary hover:underline mt-4">Volver al login</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
