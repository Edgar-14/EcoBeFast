'use client';

import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';

export default function DriversSignupPage() {
  return (
    <AuthLayout>
      <Card>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-befast-text mb-4">Registro para Repartidores</h1>
          <p className="text-gray-600 mb-6">
            Estás a punto de iniciar el proceso de registro.
            En las siguientes pantallas te pediremos tus datos personales, documentos y más.
          </p>
          <p className="text-gray-600">
            (El formulario de registro de varios pasos se implementará aquí).
          </p>
          <div className="mt-8">
            <Link href="/drivers/login" className="font-medium text-befast-secondary hover:text-befast-primary">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </Card>
    </AuthLayout>
  );
}
