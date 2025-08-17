"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';

export default function DeliveryLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(form.email, form.password);
      router.push('/dashboard/delivery');
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white">
      <main className="flex-1 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-xl shadow max-w-md w-full space-y-4 flex flex-col items-center">
          <Image src="/befast-logo.png" alt="BeFast Logo" width={80} height={80} className="mb-2" />
          <h1 className="text-2xl font-bold mb-2 text-befast-primary">Acceso Negocios</h1>
          <Input name="email" label="Correo" value={form.email} onChange={handleChange} required />
          <Input name="password" label="Contraseña" type="password" value={form.password} onChange={handleChange} required />
          {error && <div className="text-red-600">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Ingresando...' : 'Ingresar'}</Button>
          <a href="/delivery/forgot-password" className="text-sm text-befast-primary hover:underline">¿Olvidaste tu contraseña?</a>
        </form>
      </main>
      <Footer />
    </div>
  );
}
