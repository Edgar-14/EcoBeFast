"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/lib/services/adminService';

interface DashboardStats {
  totalOrders: number;
  activeDrivers: number;
  pendingApplications: number;
  todayRevenue: number;
  activeBusinesses: number;
  completedOrders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeDrivers: 0,
    pendingApplications: 0,
    todayRevenue: 0,
    activeBusinesses: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real implementation, these would be actual service calls
      // For now, we'll use mock data to show the structure
      setStats({
        totalOrders: 245,
        activeDrivers: 18,
        pendingApplications: 7,
        todayRevenue: 12500,
        activeBusinesses: 42,
        completedOrders: 230
      });

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'BF-2025-001',
          businessName: 'Tacos El Güero',
          customerName: 'María González',
          status: 'delivered',
          createdAt: new Date(),
          amount: 150
        },
        {
          id: '2',
          orderNumber: 'BF-2025-002',
          businessName: 'Farmacia San Pedro',
          customerName: 'Carlos López',
          status: 'assigned',
          createdAt: new Date(),
          amount: 75
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Centro de Control Operativo</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-MX')}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-befast-primary">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Órdenes Totales</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          <div className="text-sm text-gray-600">Completadas</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.activeDrivers}</div>
          <div className="text-sm text-gray-600">Repartidores Activos</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</div>
          <div className="text-sm text-gray-600">Solicitudes Pendientes</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.activeBusinesses}</div>
          <div className="text-sm text-gray-600">Negocios Activos</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xl font-bold text-emerald-600">
            ${stats.todayRevenue.toLocaleString('es-MX')}
          </div>
          <div className="text-sm text-gray-600">Ingresos Hoy</div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Órdenes Recientes</h2>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-gray-600">{order.businessName}</div>
                  <div className="text-xs text-gray-500">{order.customerName}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'delivered' ? 'Entregado' :
                     order.status === 'assigned' ? 'Asignado' : 'Pendiente'}
                  </div>
                  <div className="text-sm font-medium">${order.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/admin/driver-applications'}
              className="w-full justify-start"
              variant="outline"
            >
              <span className="w-4 h-4 bg-orange-500 rounded-full mr-3"></span>
              Revisar Solicitudes de Repartidores ({stats.pendingApplications})
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full justify-start"
              variant="outline"
            >
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
              Ver Todas las Órdenes
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/admin/businesses'}
              className="w-full justify-start"
              variant="outline"
            >
              <span className="w-4 h-4 bg-purple-500 rounded-full mr-3"></span>
              Gestionar Negocios
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/admin/drivers'}
              className="w-full justify-start"
              variant="outline"
            >
              <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
              Gestionar Repartidores
            </Button>

            <Button 
              onClick={() => window.location.href = '/admin/reports'}
              className="w-full justify-start"
              variant="outline"
            >
              <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
              Generar Reportes
            </Button>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Estado del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">API Operativa</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Base de Datos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Pagos Stripe</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Shipday Sync</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
