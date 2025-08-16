'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';

import Step1_PersonalData from './Step1_PersonalData';
import Step2_Documents from './Step2_Documents';
// The components for each step will be created later
import Step3_Legal from './Step3_Legal';
import Step4_Training from './Step4_Training';

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting application with data:", formData);
    // In a real application, you would send this data to a Firebase Function.
    // The function would handle file uploads to Storage and save data to Firestore.
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Application submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-befast-success mb-4">¡Solicitud Enviada!</h2>
          <p className="text-gray-600">
            Hemos recibido tu solicitud. Nuestro equipo la revisará y te notificaremos por correo electrónico sobre los siguientes pasos.
          </p>
          <p className="text-gray-600 mt-2">El proceso de revisión puede tardar de 2 a 3 días hábiles.</p>
        </div>
      </Card>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_PersonalData formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2_Documents formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3_Legal formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4_Training formData={formData} setFormData={setFormData} />;
      default:
        return <div>Paso 1: Datos Fundamentales</div>;
    }
  };

  const totalSteps = 4;

  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-befast-text mb-2">Registro de Repartidor</h1>
      <p className="text-center text-gray-500 mb-6">Paso {step} de {totalSteps}</p>

      <div className="mb-6">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={prevStep} className="text-gray-700 font-bold py-2 px-4 rounded">
            Atrás
          </button>
        )}
        {step < totalSteps ? (
          <button onClick={nextStep} className="bg-befast-secondary text-white font-bold py-2 px-4 rounded">
            Siguiente
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-befast-success text-white font-bold py-2 px-4 rounded disabled:opacity-50">
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        )}
      </div>
    </Card>
  );
};

export default OnboardingForm;
