'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const Step3_Legal = ({ formData, setFormData }) => {
  const sigCanvas = useRef(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDigitalSignature, setAcceptedDigitalSignature] = useState(false);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setFormData({ ...formData, signature: null });
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Por favor, proporciona tu firma.");
      return;
    }
    const signatureData = sigCanvas.current.toDataURL();
    setFormData({ ...formData, signature: signatureData });
    console.log("Signature saved (placeholder).");
  };

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Contrato y Acuerdos Legales</legend>
        <div className="prose prose-sm max-w-none h-48 overflow-y-auto border p-4 rounded-md">
          <h4>Contrato Individual de Trabajo</h4>
          <p>Este es un placeholder para el texto completo del Contrato Individual de Trabajo y todos sus anexos (Protocolo de Revisión, Política de Gestión Algorítmica, etc.). El aspirante debe poder revisar y descargar este contenido.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
          {/* ... more placeholder text ... */}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Firma Digital</legend>
        <div className="border border-gray-300 rounded-md">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ className: 'w-full h-32' }}
            onEnd={saveSignature}
          />
        </div>
        <button type="button" onClick={clearSignature} className="text-sm text-befast-secondary hover:underline">
          Limpiar Firma
        </button>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-lg font-medium text-befast-text">Confirmación de Lectura y Aceptación</legend>
        <div className="flex items-start">
          <input id="acceptTerms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="h-4 w-4 text-befast-primary focus:ring-befast-primary border-gray-300 rounded" />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">He leído, comprendido y acepto en su totalidad el Contrato y sus anexos.</label>
        </div>
        <div className="flex items-start">
          <input id="acceptDigital" type="checkbox" checked={acceptedDigitalSignature} onChange={(e) => setAcceptedDigitalSignature(e.target.checked)} className="h-4 w-4 text-befast-primary focus:ring-befast-primary border-gray-300 rounded" />
          <label htmlFor="acceptDigital" className="ml-2 block text-sm text-gray-900">Entiendo que esta aceptación digital tiene la misma validez legal que una firma autógrafa.</label>
        </div>
      </fieldset>
    </div>
  );
};

export default Step3_Legal;
