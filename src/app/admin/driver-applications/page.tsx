'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';

const applications = [
  { id: 1, name: 'Juan Pérez', date: '2025-08-15', progress: '4/4 Pasos', status: 'Nuevas Solicitudes' },
  { id: 2, name: 'Maria García', date: '2025-08-14', progress: '4/4 Pasos', status: 'En Revisión' },
  { id: 3, name: 'Pedro Martinez', date: '2025-08-13', progress: '4/4 Pasos', status: 'Aprobadas' },
  { id: 4, name: 'Ana Lopez', date: '2025-08-12', progress: '3/4 Pasos', status: 'Rechazadas' },
];

const statusColors = {
  'Nuevas Solicitudes': 'bg-blue-100 text-blue-800',
  'En Revisión': 'bg-yellow-100 text-yellow-800',
  'Aprobadas': 'bg-green-100 text-green-800',
  'Rechazadas': 'bg-red-100 text-red-800',
};

const DriverApplicationsPage = () => {
  const [view, setView] = useState('table'); // 'table' or 'kanban'

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-befast-text">Gestión de Solicitudes</h1>
        <div>
          <button onClick={() => setView('table')} className={`px-4 py-2 rounded-l-md ${view === 'table' ? 'bg-befast-primary text-white' : 'bg-white'}`}>Tabla</button>
          <button onClick={() => setView('kanban')} className={`px-4 py-2 rounded-r-md ${view === 'kanban' ? 'bg-befast-primary text-white' : 'bg-white'}`}>Kanban</button>
        </div>
      </div>

      <Card>
        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Fecha de Solicitud</th>
                  <th className="py-2 px-4 border-b">Progreso</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-2 px-4 border-b text-center">{app.name}</td>
                    <td className="py-2 px-4 border-b text-center">{app.date}</td>
                    <td className="py-2 px-4 border-b text-center">{app.progress}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button className="text-befast-secondary hover:underline">Revisar Solicitud</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <p className="text-center text-gray-500">(La vista Kanban se implementará aquí)</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriverApplicationsPage;
