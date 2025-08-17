"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';
import { exportToExcel } from '@/lib/utils/exportToExcel';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
];

export default function AdminPayrollPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getCreditPurchaseRequests(status || undefined);
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: requests,
        filename: 'pagos_manual.xlsx',
        sheetName: 'Pagos',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Pagos Manuales y Nómina</h1>
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
                <th className="px-4 py-2 text-left">Negocio</th>
                <th className="px-4 py-2 text-left">Paquete</th>
                <th className="px-4 py-2 text-left">Costo</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{req.id}</td>
                  <td className="px-4 py-2">{req.businessName}</td>
                  <td className="px-4 py-2">{req.packageName}</td>
                  <td className="px-4 py-2">${req.packageCost ?? 0}</td>
                  <td className="px-4 py-2">{req.status}</td>
                  <td className="px-4 py-2">{req.requestDate ? new Date(req.requestDate.seconds ? req.requestDate.seconds * 1000 : req.requestDate).toLocaleString() : ''}</td>
                  <td className="px-4 py-2">{/* Acciones de aprobar/rechazar aquí */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
