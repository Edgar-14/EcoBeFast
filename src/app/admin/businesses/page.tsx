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
  { value: 'PENDING_VERIFICATION', label: 'Pendiente de Verificación' },
];

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getBusinesses(status || undefined);
      setBusinesses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: businesses,
        filename: 'negocios.xlsx',
        sheetName: 'Negocios',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Negocios Afiliados</h1>
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
                <th className="px-4 py-2 text-left">Créditos</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(business => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{business.id}</td>
                  <td className="px-4 py-2">{business.businessName}</td>
                  <td className="px-4 py-2">{business.email}</td>
                  <td className="px-4 py-2">{business.phone}</td>
                  <td className="px-4 py-2">{business.availableCredits ?? 0}</td>
                  <td className="px-4 py-2">{business.status}</td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/businesses/${business.id}`} className="text-befast-primary hover:underline">Ver Detalle</Link>
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
