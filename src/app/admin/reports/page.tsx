"use client";
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';
import { exportToExcel } from '@/lib/utils/exportToExcel';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(false);

  const handleExportGlobal = async () => {
    setLoading(true);
    try {
      // Obtener todas las órdenes (puedes agregar filtros según sea necesario)
      const orders = await AdminService.getOrders();
      exportToExcel({
        data: orders,
        filename: `reporte_global_pedidos.xlsx`,
        sheetName: 'Órdenes',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Globales</h1>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="font-semibold">Exportar reportes operativos y financieros de toda la operación</div>
            <div className="text-gray-600 text-sm">Puedes filtrar por fechas, negocios, repartidores, etc.</div>
          </div>
          <Button onClick={handleExportGlobal} variant="primary" disabled={loading}>
            {loading ? 'Exportando...' : 'Exportar Reporte Global'}
          </Button>
        </div>
      </Card>
      {/* Aquí irán los filtros y tablas de resumen */}
    </div>
  );
}
