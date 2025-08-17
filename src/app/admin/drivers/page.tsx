"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';
import { exportToExcel } from '@/lib/utils/exportToExcel';
import Link from 'next/link';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
  { value: 'ALTA_PROVISIONAL', label: 'Alta Provisional' },
  { value: 'ACTIVO_COTIZANDO', label: 'Cotizando' },
];

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getDrivers(status || undefined);
      setDrivers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: drivers,
        filename: 'repartidores.xlsx',
        sheetName: 'Repartidores',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestión de Repartidores</h1>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>
      <Card>
        {loading ? (
          <div className="p-4">Cargando...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Saldo</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{driver.id}</td>
                  <td className="px-4 py-2">{driver.fullName}</td>
                  <td className="px-4 py-2">{driver.email}</td>
                  <td className="px-4 py-2">{driver.phone}</td>
                  <td className="px-4 py-2">{driver.status}</td>
                  <td className="px-4 py-2">${driver.walletBalance ?? 0}</td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/drivers/${driver.id}`} className="text-befast-primary hover:underline">Ver Detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
