"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';
import { exportToExcel } from '@/lib/utils/exportToExcel';

export default function DriverProfilePage() {
  const { id } = useParams();
  const [driver, setDriver] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      try {
        const data = await AdminService.getDriver(id as string);
        setDriver(data);
        const driverOrders = await AdminService.getOrders({ driverId: id as string });
        setOrders(driverOrders);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDriver();
  }, [id]);

  const handleExportReport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: orders,
        filename: `reporte_repartidor_${id}.xlsx`,
        sheetName: 'Órdenes',
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!driver) return <div className="p-6">No se encontró el repartidor.</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Perfil del Repartidor</h1>
          <Button onClick={handleExportReport} variant="primary" disabled={exporting}>
            {exporting ? 'Exportando...' : 'Exportar Reporte'}
          </Button>
        </div>
        {/* Aquí irán los datos del repartidor, documentos, historial, etc. */}
        <div>Nombre: {driver.fullName}</div>
        <div>Email: {driver.email}</div>
        {/* ...más campos... */}
      </Card>
      {/* Tabs para historial, actividad, documentos, etc. */}
    </div>
  );
}
