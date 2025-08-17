'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function DeliveryLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate Firebase login
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you'd use signInWithEmailAndPassword from Firebase
      if (email === 'test@negocio.com' && password === 'password') {
        console.log('Login successful');
        router.push('/delivery/dashboard');
      } else {
        throw new Error('Credenciales inválidas. Intenta con test@negocio.com');
      }
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
  <h1 className="text-2xl font-bold text-center title-gradient mb-6">Iniciar Sesión - Negocios</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="tu@negocio.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="********"
              required
            />
          </div>
          {error && <p className="text-sm text-befast-error text-center">{error}</p>}
          <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/delivery/signup" className="font-medium text-befast-secondary hover:text-befast-primary">
            Regístrate aquí
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
