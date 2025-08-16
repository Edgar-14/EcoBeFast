'use client';

import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function DeliverySignupPage() {
  return (
    <AuthLayout>
      <Card>
        <h1 className="text-2xl font-bold text-center text-befast-text mb-6">Registro para Negocios</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
            <input type="text" id="businessName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Nombre del Contacto</label>
            <input type="text" id="contactName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input type="text" id="address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono del Negocio</label>
            <input type="tel" id="phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <PrimaryButton type="submit" className="w-full">
            Registrar mi Negocio
          </PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/delivery/login" className="font-medium text-befast-secondary hover:text-befast-primary">
            Inicia sesión aquí
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
