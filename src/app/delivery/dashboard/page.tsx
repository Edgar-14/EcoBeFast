'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';

type FormInputProps = {
  id: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({ id, label, value, onChange, required = true, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary disabled:bg-gray-100"
    />
  </div>
);

export default function DeliveryDashboardPage() {
  const [order, setOrder] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    amountToCollect: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating order:', order);
    alert('Creando pedido... (simulación)');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold title-gradient">Dashboard de Negocio</h1>
        <Card className="!p-4 text-center">
          <p className="text-lg font-bold text-befast-secondary">10 Créditos</p>
          <p className="text-sm text-gray-500">disponibles</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-befast-text mb-6">Nuevo Pedido</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pickup Section */}
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-befast-text mb-4">Recogida</legend>
            <FormInput id="pickupName" label="Nombre del Negocio" value="Mi Negocio Ficticio" disabled onChange={() => {}} />
            <FormInput id="pickupAddress" label="Dirección de Origen" value="Calle Falsa 123, Col. Centro" disabled onChange={() => {}} />
            <FormInput id="pickupPhone" label="Teléfono de Origen" value="3121234567" disabled onChange={() => {}} />
          </fieldset>

          {/* Delivery Section */}
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-befast-text mb-4">Entrega</legend>
            <FormInput id="customerName" label="Nombre del cliente" value={order.customerName} onChange={handleChange} />
            <FormInput id="customerPhone" label="Teléfono del cliente" value={order.customerPhone} onChange={handleChange} />
            <FormInput id="deliveryAddress" label="Dirección de entrega (con Google Maps Autocomplete)" value={order.deliveryAddress} onChange={handleChange} />
            <FormInput id="amountToCollect" label="Monto a cobrar" value={order.amountToCollect} onChange={handleChange} />
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Instrucciones especiales de entrega</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={order.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-befast-primary focus:border-befast-primary"
              ></textarea>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex gap-4">
              <button type="button" className="text-sm text-befast-secondary hover:underline">Cargar último pedido</button>
              <button type="button" className="text-sm text-befast-secondary hover:underline">Guardar Dirección</button>
            </div>
            <PrimaryButton type="submit" className="w-full sm:w-auto">
              Crear Pedido
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
