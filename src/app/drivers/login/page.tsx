'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthLayout from '@/components/AuthLayout';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function DriversLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        router.push('/drivers/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-2xl font-bold text-center title-gradient mb-6">Iniciar Sesión - Repartidores</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="tu@email.com"
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
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary sm:text-sm"
              placeholder="********"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Iniciar Sesión'}
          </PrimaryButton>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/drivers/signup" className="font-medium text-befast-secondary hover:text-befast-primary">
            Regístrate aquí
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
