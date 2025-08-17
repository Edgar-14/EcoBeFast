'use client';

import AuthLayout from '@/components/AuthLayout';
import OnboardingForm from '@/components/drivers/OnboardingForm';

export default function DriversSignupPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center title-gradient mb-6">Registro de Repartidor</h1>
      <OnboardingForm />
    </AuthLayout>
  );
}
