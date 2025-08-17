'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function DeliverySignupPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate Firebase user creation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (formData.email.includes('test')) {
        throw new Error('Este correo de prueba ya está registrado.');
      }
      console.log('Signup successful for:', formData.email);
      router.push('/delivery/login?signup=success');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
    <h1 className="text-2xl font-bold text-center title-gradient mb-6">Registro de Negocio</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
            <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Nombre del Contacto</label>
            <input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono del Negocio</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required pattern="\d{10}" title="El teléfono debe tener 10 dígitos" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary" />
          </div>
          {error && <p className="text-sm text-befast-error text-center">{error}</p>}
          <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar mi Negocio'}
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
