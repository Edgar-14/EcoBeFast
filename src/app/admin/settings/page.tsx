"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const data = await AdminService.getSystemConfig();
        setConfig(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar configuración');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Aquí deberías llamar a una función real para guardar la configuración
      // await AdminService.updateSystemConfig(config);
      alert('Funcionalidad de guardado en desarrollo');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Configuración Global</h1>
      <Card>
        {loading ? (
          <div className="p-4">Cargando...</div>
        ) : config ? (
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Salario Mínimo Mensual</label>
              <input
                type="number"
                name="salarioMinimoMensual"
                value={config.salarioMinimoMensual}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">Comisión Efectivo (%)</label>
              <input
                type="number"
                name="comisionEfectivo"
                value={config.comisionEfectivo}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">Límite de Deuda Default</label>
              <input
                type="number"
                name="debtLimitDefault"
                value={config.debtLimitDefault}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">% IMSS</label>
              <input
                type="number"
                name="porcentajeIMSS"
                value={config.porcentajeIMSS}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">% ISR</label>
              <input
                type="number"
                name="porcentajeISR"
                value={config.porcentajeISR}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        ) : (
          <div className="p-4 text-red-600">No se pudo cargar la configuración.</div>
        )}
      </Card>
    </div>
  );
}
