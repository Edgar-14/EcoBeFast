import ProtectedRouteDriver from '@/components/ProtectedRouteDriver';
import Card from '@/components/ui/Card';

export default function DriversDashboardPage() {
  return (
    <ProtectedRouteDriver>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-befast-text mb-6">Panel del Repartidor</h1>
        <Card>
          <p className="mb-2">Bienvenido, aquí verás tus pedidos asignados, historial y estado.</p>
          {/* Aquí se mostrarán los pedidos y el estado del conductor */}
        </Card>
      </div>
    </ProtectedRouteDriver>
  );
}
