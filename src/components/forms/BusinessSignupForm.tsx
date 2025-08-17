'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/lib/hooks/useToast';
import { useAuth } from '@/components/auth/AuthProvider';
import { businessSignupSchema } from '@/lib/utils/validations';
import { getPasswordStrength } from '@/lib/utils/validations';
// import AddressAutocomplete from '@/components/maps/AddressAutocomplete';

type BusinessSignupData = {
  businessName: string;
  contactName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export default function BusinessSignupForm() {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const router = useRouter();
  const { signUp } = useAuth();
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BusinessSignupData>({
    resolver: zodResolver(businessSignupSchema)
  });

  const password = watch('password');

  React.useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    }
  }, [password]);

  const onSubmit = async (data: BusinessSignupData) => {
    if (!selectedAddress) {
      error('Por favor selecciona una dirección válida');
      return;
    }

    setLoading(true);
    try {
      await signUp(data.email, data.password, {
        userType: 'BUSINESS',
        businessName: data.businessName,
        contactName: data.contactName,
        phone: data.phone,
        location: selectedAddress,
        displayName: data.businessName
      });

      success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
      router.push('/delivery/verify-email');
    } catch (err: any) {
      error(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (addressData: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setSelectedAddress(addressData);
    setValue('address', addressData.address);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('businessName')}
        label="Nombre del Negocio"
        placeholder="Ej. Restaurante La Cocina"
        icon={<Building />}
        error={errors.businessName?.message}
        fullWidth
      />
      <Input
        {...register('contactName')}
        label="Nombre del Contacto"
        placeholder="Tu nombre completo"
        icon={<User />}
        error={errors.contactName?.message}
        fullWidth
      />
      <Input
        {...register('email')}
        type="email"
        label="Correo Electrónico"
        placeholder="negocio@ejemplo.com"
        icon={<Mail />}
        error={errors.email?.message}
        fullWidth
      />
      <div>
        <Input
          {...register('password')}
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          icon={<Lock />}
          error={errors.password?.message}
          fullWidth
        />
        {password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{passwordStrength.label}</span>
            </div>
          </div>
        )}
      </div>
      <Input
        {...register('phone')}
        type="tel"
        label="Teléfono"
        placeholder="3121234567"
        icon={<Phone />}
        error={errors.phone?.message}
        fullWidth
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección del Negocio
        </label>
        {/* <AddressAutocomplete
          onPlaceSelect={handleAddressSelect}
          placeholder="Busca y selecciona tu dirección"
          icon={<MapPin />}
        /> */}
        <p>AddressAutocomplete component will be here</p>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Crear Cuenta
      </Button>
    </form>
  );
}
