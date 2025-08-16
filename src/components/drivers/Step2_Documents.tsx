import React from 'react';

// A simple reusable file input component
const FileInput = ({ id, label, onChange, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="file"
      id={id}
      name={id}
      onChange={onChange}
      required={required}
      accept="image/jpeg,image/png,application/pdf"
      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-befast-secondary file:text-white hover:file:bg-befast-primary"
    />
  </div>
);

const Step2_Documents = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  return (
    <form className="space-y-6">
      <p className="text-sm text-gray-600">Sube tus documentos en formato PDF, JPG o PNG.</p>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Documentos de Identificación</legend>
        <FileInput id="ineFront" label="INE o Pasaporte (Frente)" onChange={handleFileChange} />
        <FileInput id="ineBack" label="INE o Pasaporte (Reverso)" onChange={handleFileChange} />
        <FileInput id="addressProof" label="Comprobante de Domicilio (no mayor a 3 meses)" onChange={handleFileChange} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Documentos Laborales</legend>
        <FileInput id="taxId" label="Constancia de Situación Fiscal (actualizada)" onChange={handleFileChange} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Documentos de Conducir</legend>
        <FileInput id="driverLicense" label="Licencia de Conducir (vigente)" onChange={handleFileChange} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Documentos Vehiculares</legend>
        <FileInput id="vehicleRegistration" label="Tarjeta de Circulación (vigente)" onChange={handleFileChange} />
        <FileInput id="vehicleInsurance" label="Póliza de Seguro Vehicular (vigente)" onChange={handleFileChange} />
      </fieldset>
    </form>
  );
};

export default Step2_Documents;
