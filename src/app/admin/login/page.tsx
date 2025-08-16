'use client';

import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function AdminLoginPage() {
  return (
    <AuthLayout>
      <Card>
        <h1 className="text-2xl font-bold text-center text-befast-text mb-6">Portal de Administrador</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="admin@befast.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="********"
            />
          </div>
          <div className="text-right text-sm">
            <Link href="/admin/forgot-password" passHref>
              <span className="font-medium text-befast-secondary hover:text-befast-primary cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
            </Link>
          </div>
          <PrimaryButton type="submit" className="w-full">
            Iniciar Sesión
          </PrimaryButton>
        </form>
      </Card>
    </AuthLayout>
  );
}
