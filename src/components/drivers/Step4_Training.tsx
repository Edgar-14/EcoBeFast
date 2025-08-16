import React from 'react';

const Step4_Training = ({ formData, setFormData }) => {
  const handleAnswerChange = (questionId, answer) => {
    setFormData({
      ...formData,
      quiz: {
        ...formData.quiz,
        [questionId]: answer,
      },
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      thermalBagPhoto: e.target.files[0],
    });
  };

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Módulos de Capacitación</legend>
        <p className="text-sm text-gray-600">Por favor, mira los siguientes videos de capacitación antes de responder el cuestionario.</p>
        <div className="aspect-w-16 aspect-h-9">
          {/* Placeholder for video */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-md">
            <p className="text-gray-500">Video de Capacitación 1</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Cuestionario Final</legend>
        {/* Question 1 */}
        <div className="space-y-2">
          <p className="font-medium">1. ¿Qué debes hacer si un cliente no responde?</p>
          <div className="flex items-center">
            <input id="q1a1" name="q1" type="radio" className="h-4 w-4" onChange={() => handleAnswerChange('q1', 'a')} />
            <label htmlFor="q1a1" className="ml-3 block text-sm">A) Esperar 5 minutos y contactar a soporte.</label>
          </div>
          <div className="flex items-center">
            <input id="q1a2" name="q1" type="radio" className="h-4 w-4" onChange={() => handleAnswerChange('q1', 'b')} />
            <label htmlFor="q1a2" className="ml-3 block text-sm">B) Dejar el pedido en la puerta.</label>
          </div>
        </div>
        {/* Question 2 */}
        <div className="space-y-2">
          <p className="font-medium">2. ¿Cuál es el protocolo en caso de un derrame?</p>
          <div className="flex items-center">
            <input id="q2a1" name="q2" type="radio" className="h-4 w-4" onChange={() => handleAnswerChange('q2', 'a')} />
            <label htmlFor="q2a1" className="ml-3 block text-sm">A) Limpiar y continuar la entrega.</label>
          </div>
          <div className="flex items-center">
            <input id="q2a2" name="q2" type="radio" className="h-4 w-4" onChange={() => handleAnswerChange('q2', 'b')} />
            <label htmlFor="q2a2" className="ml-3 block text-sm">B) Notificar a soporte inmediatamente.</label>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Evidencia Fotográfica</legend>
        <div>
          <label htmlFor="thermalBagPhoto" className="block text-sm font-medium text-gray-700">Sube una fotografía de tu mochila térmica</label>
          <input
            type="file"
            id="thermalBagPhoto"
            name="thermalBagPhoto"
            onChange={handleFileChange}
            required
            accept="image/jpeg,image/png"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-befast-secondary file:text-white hover:file:bg-befast-primary"
          />
        </div>
      </fieldset>
    </div>
  );
};

export default Step4_Training;
