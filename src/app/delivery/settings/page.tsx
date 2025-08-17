"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { BusinessService } from '@/lib/services/businessService';
import Footer from '@/components/ui/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import Image from 'next/image';

export default function DeliverySettingsPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    BusinessService.getProfile(user.uid).then(data => {
      if (!data) {
        setLoading(false);
        return;
      }
      setBusiness(data);
      setForm({
        businessName: data.businessName || '',
        contactName: data.contactName || '',
        phone: data.phone || '',
        address: data.location?.address || '',
      });
      setLoading(false);
    });
  }, [user]);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (!user) throw new Error('Usuario no autenticado');
      await BusinessService.updateProfile(user.uid, {
        businessName: form.businessName,
        contactName: form.contactName,
        phone: form.phone,
        location: {
          address: form.address,
          coordinates: business?.location?.coordinates || { lat: 0, lng: 0 },
        },
      });
      setMessage('Datos actualizados correctamente.');
    } catch (err: any) {
      setError(err.message || 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loading text="Cargando configuración..." /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white animate-fade-in">
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-lg bg-white/90 rounded-xl shadow p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-befast-primary mb-6">Configuración de Negocio</h1>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input name="businessName" label="Nombre del Negocio" value={form.businessName} onChange={handleChange} required minLength={3} />
            <Input name="contactName" label="Nombre del Contacto" value={form.contactName} onChange={handleChange} required minLength={3} />
            <Input name="phone" label="Teléfono" value={form.phone} onChange={handleChange} required pattern="\d{10}" maxLength={10} />
            <Input name="address" label="Dirección" value={form.address} onChange={handleChange} required />
            {error && <div className="text-red-600 animate-shake">{error}</div>}
            {message && <div className="text-green-600 animate-fade-in">{message}</div>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loading size="sm" /> : 'Guardar Cambios'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
