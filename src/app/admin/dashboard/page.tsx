import Card from '@/components/ui/Card';
import ProtectedRouteAdmin from '@/components/ProtectedRouteAdmin';

const StatCard = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-befast-text">{value}</p>
      </div>
    </div>
  </Card>
);

const AdminDashboardPage = () => {
  return (
    <ProtectedRouteAdmin>
      <div>
        <h1 className="text-3xl font-bold text-befast-text mb-6">Centro de Comando</h1>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Solicitudes Pendientes" value="12" icon="📝" />
          <StatCard title="Repartidores Activos" value="87" icon="🚚" />
          <StatCard title="Pedidos del Día" value="256" icon="📦" />
        </div>
        {/* Graphs and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Graph */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Gráficos de Rendimiento</h2>
            <div className="h-64 bg-gray-200 flex items-center justify-center rounded-md">
              <p className="text-gray-500">(Placeholder para visualizaciones de datos)</p>
            </div>
          </Card>
          {/* Alerts */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Alertas del Sistema</h2>
            <div className="space-y-4">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded">
                <p className="font-bold">Nueva Solicitud</p>
                <p>Juan Pérez ha completado su solicitud de repartidor.</p>
              </div>
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                <p className="font-bold">Error Crítico</p>
                <p>Fallo en la sincronización con la API de Shipday.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRouteAdmin>
  );
};

export default AdminDashboardPage;
