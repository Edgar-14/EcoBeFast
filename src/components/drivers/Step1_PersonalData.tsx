import React from 'react';

// A simple reusable input component for this form
const FormInput = ({ id, label, type = 'text', value, onChange, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary"
    />
  </div>
);

const Step1_PersonalData = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="space-y-6">
      {/* Account Data */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Datos de la Cuenta</legend>
        <FormInput id="email" label="Correo Electrónico (será tu usuario)" type="email" value={formData.email || ''} onChange={handleChange} />
        <FormInput id="password" label="Contraseña" type="password" value={formData.password || ''} onChange={handleChange} />
      </fieldset>

      {/* Personal Data */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Datos Personales</legend>
        <FormInput id="fullName" label="Nombre Completo" value={formData.fullName || ''} onChange={handleChange} />
        <FormInput id="phone" label="Teléfono de Contacto" type="tel" value={formData.phone || ''} onChange={handleChange} />
        <FormInput id="address" label="Dirección Completa" value={formData.address || ''} onChange={handleChange} />
        <FormInput id="curp" label="CURP" value={formData.curp || ''} onChange={handleChange} />
        <FormInput id="rfc" label="RFC" value={formData.rfc || ''} onChange={handleChange} />
        <FormInput id="nss" label="NSS (Número de Seguridad Social)" value={formData.nss || ''} onChange={handleChange} />
      </fieldset>

      {/* Vehicle Information */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Información del Vehículo</legend>
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
          <select id="vehicleType" name="vehicleType" value={formData.vehicleType || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-befast-primary focus:border-befast-primary">
            <option value="">Selecciona uno...</option>
            <option value="motocicleta">Motocicleta</option>
            <option value="automovil">Automóvil</option>
            <option value="bicicleta">Bicicleta</option>
          </select>
        </div>
        <FormInput id="vehicleBrand" label="Marca del vehículo" value={formData.vehicleBrand || ''} onChange={handleChange} />
        <FormInput id="vehicleModel" label="Modelo del vehículo" value={formData.vehicleModel || ''} onChange={handleChange} />
        <FormInput id="vehicleYear" label="Año del vehículo" type="number" value={formData.vehicleYear || ''} onChange={handleChange} />
        <FormInput id="vehiclePlates" label="Placas del vehículo" value={formData.vehiclePlates || ''} onChange={handleChange} />
        <FormInput id="vehicleColor" label="Color del vehículo" value={formData.vehicleColor || ''} onChange={handleChange} />
      </fieldset>

      {/* Bank Data */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-befast-text">Datos Bancarios (Para Pagos)</legend>
        <FormInput id="bankName" label="Nombre del Banco" value={formData.bankName || ''} onChange={handleChange} />
        <FormInput id="clabe" label="CLABE Interbancaria (18 dígitos)" value={formData.clabe || ''} onChange={handleChange} />
      </fieldset>
    </form>
  );
};

export default Step1_PersonalData;
