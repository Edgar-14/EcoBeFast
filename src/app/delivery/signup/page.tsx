"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';

// TODO: Reemplazar por componente real de Google Maps Autocomplete
function AddressAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Input
      name="address"
      label="Dirección del Negocio"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
    />
  );
}

function PasswordStrength({ value }: { value: string }) {
  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;
  const levels = ["Débil", "Regular", "Buena", "Fuerte"];
  return (
    <div className="text-xs mt-1">
      Fortaleza: <span className={
        strength < 2 ? 'text-red-500' : strength === 2 ? 'text-yellow-500' : 'text-green-600'
      }>{levels[strength] || levels[0]}</span>
    </div>
  );
}

export default function DeliverySignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    // Validaciones básicas
    if (form.businessName.length < 3) return setError('El nombre del negocio debe tener al menos 3 caracteres.');
    if (form.contactName.length < 3) return setError('El nombre del contacto debe tener al menos 3 caracteres.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError('Correo electrónico inválido.');
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (!/^\d{10}$/.test(form.phone)) return setError('El teléfono debe tener 10 dígitos.');
    if (!form.address) return setError('La dirección es obligatoria.');
    setLoading(true);
    try {
      await signUp(
        form.email,
        form.password,
        {
          businessName: form.businessName,
          contactName: form.contactName,
          address: form.address,
          phone: form.phone,
          userType: 'business',
        }
      );
      router.push('/delivery/verify-email');
    } catch (err: any) {
      setError(err.message || 'Error al registrar el negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white">
      <main className="flex-1 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-xl shadow max-w-md w-full space-y-4 flex flex-col items-center">
          <Image src="/befast-logo.png" alt="BeFast Logo" width={80} height={80} className="mb-2" />
          <h1 className="text-2xl font-bold mb-2 text-befast-primary">Registro de Negocio</h1>
          <Input name="businessName" label="Nombre del Negocio" value={form.businessName} onChange={handleChange} required minLength={3} />
          <Input name="contactName" label="Nombre del Contacto" value={form.contactName} onChange={handleChange} required minLength={3} />
          <Input name="email" label="Correo Electrónico" value={form.email} onChange={handleChange} required type="email" />
          <Input name="phone" label="Teléfono del Negocio" value={form.phone} onChange={handleChange} required pattern="\d{10}" maxLength={10} />
          <AddressAutocomplete value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <Input name="password" label="Contraseña" value={form.password} onChange={handleChange} required type="password" minLength={8} />
          <PasswordStrength value={form.password} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Registrando...' : 'Registrarse'}</Button>
          <a href="/delivery/login" className="text-sm text-befast-primary hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
        </form>
      </main>
      <Footer />
    </div>
  );
}
