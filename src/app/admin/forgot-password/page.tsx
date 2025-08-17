"use client";
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';

export default function AdminForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Revisa tu correo para restablecer tu contraseña.');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white">
      <main className="flex-1 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-xl shadow max-w-md w-full space-y-4 flex flex-col items-center">
          <Image src="/befast-logo.png" alt="BeFast Logo" width={80} height={80} className="mb-2" />
          <h1 className="text-2xl font-bold mb-2 text-befast-primary">Recuperar Contraseña</h1>
          <Input name="email" label="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
          {error && <div className="text-red-600">{error}</div>}
          {message && <div className="text-green-600">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Enviando...' : 'Enviar'}</Button>
          <a href="/admin/login" className="text-sm text-befast-primary hover:underline">Volver al login</a>
        </form>
      </main>
      <Footer />
    </div>
  );
}
