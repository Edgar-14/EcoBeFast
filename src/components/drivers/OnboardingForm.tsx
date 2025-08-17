'use client';

import { useState } from 'react';
// Tipado fuerte para los datos del formulario de onboarding
export interface DriverOnboardingData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  ineFront?: File;
  ineBack?: File;
  addressProof?: File;
  taxId?: File;
  signature?: string;
  quiz?: Record<string, string>;
  thermalBagPhoto?: File;
}
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Card from '@/components/ui/Card';

import Step1_PersonalData from './Step1_PersonalData';
import Step2_Documents from './Step2_Documents';
// The components for each step will be created later
import Step3_Legal from './Step3_Legal';
import Step4_Training from './Step4_Training';

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DriverOnboardingData>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    // Los archivos y otros campos se agregan dinámicamente
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      // 2. Subir archivos a Storage y obtener URLs
  const uploadFile = async (file: File | undefined, path: string): Promise<string | null> => {
        if (!file) return null;
        const storageRef = ref(storage, `${path}/${uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      };

      const ineFrontUrl = await uploadFile(formData.ineFront, 'drivers/ineFront');
      const ineBackUrl = await uploadFile(formData.ineBack, 'drivers/ineBack');
      const addressProofUrl = await uploadFile(formData.addressProof, 'drivers/addressProof');
      const taxIdUrl = await uploadFile(formData.taxId, 'drivers/taxId');
      const thermalBagPhotoUrl = await uploadFile(formData.thermalBagPhoto, 'drivers/thermalBagPhoto');

      // 3. Guardar datos en Firestore
      await setDoc(doc(db, 'drivers', uid), {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        ineFrontUrl,
        ineBackUrl,
        addressProofUrl,
        taxIdUrl,
        signature: formData.signature || null,
        quiz: formData.quiz || {},
        thermalBagPhotoUrl,
        createdAt: new Date(),
        status: 'pending',
        uid,
      });
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
