"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { exportToExcel } from '@/lib/utils/exportToExcel';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminIncentivesPage() {
  const [incentives, setIncentives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchIncentives = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'incentives'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setIncentives(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncentives();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportToExcel({
        data: incentives,
        filename: 'incentivos.xlsx',
        sheetName: 'Incentivos',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Incentivos y Campañas</h1>
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exportando...' : 'Exportar Excel'}
        </Button>
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
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Monto</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {incentives.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{inc.id}</td>
                  <td className="px-4 py-2">{inc.name}</td>
                  <td className="px-4 py-2">{inc.type}</td>
                  <td className="px-4 py-2">${inc.amount ?? 0}</td>
                  <td className="px-4 py-2">{inc.status}</td>
                  <td className="px-4 py-2">{inc.createdAt ? new Date(inc.createdAt.seconds ? inc.createdAt.seconds * 1000 : inc.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
