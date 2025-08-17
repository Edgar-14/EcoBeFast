'use client';

import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  variant = 'default',
  className
}) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    // Business statuses
    'PENDING_VERIFICATION': { color: 'bg-yellow-500 text-white', label: 'Pendiente Verificación' },
    'ACTIVE': { color: 'bg-befast-success text-white', label: 'Activo' },
    'SUSPENDED': { color: 'bg-befast-error text-white', label: 'Suspendido' },

    // Driver statuses
    'ALTA_PROVISIONAL': { color: 'bg-blue-500 text-white', label: 'Alta Provisional' },
    'ACTIVO_COTIZANDO': { color: 'bg-befast-success text-white', label: 'Activo Cotizando' },
    'INACTIVE': { color: 'bg-gray-500 text-white', label: 'Inactivo' },

    // Application statuses
    'pending_review': { color: 'bg-yellow-500 text-white', label: 'En Revisión' },
    'approved': { color: 'bg-befast-success text-white', label: 'Aprobada' },
    'rejected': { color: 'bg-befast-error text-white', label: 'Rechazada' },

    // Order statuses
    'created': { color: 'bg-blue-500 text-white', label: 'Creado' },
    'assigned': { color: 'bg-purple-500 text-white', label: 'Asignado' },
    'at_pickup': { color: 'bg-yellow-500 text-white', label: 'En Recogida' },
    'picked_up': { color: 'bg-orange-500 text-white', label: 'Recogido' },
    'at_dropoff': { color: 'bg-blue-600 text-white', label: 'En Entrega' },
    'delivered': { color: 'bg-befast-success text-white', label: 'Entregado' },
    'cancelled': { color: 'bg-gray-500 text-white', label: 'Cancelado' },
    'failed': { color: 'bg-befast-error text-white', label: 'Fallido' },

    // Payment statuses
    'pending': { color: 'bg-yellow-500 text-white', label: 'Pendiente' },
    'completed': { color: 'bg-befast-success text-white', label: 'Completado' },
    'failed_payment': { color: 'bg-befast-error text-white', label: 'Fallido' },

    // IMSS statuses
    'PROVISIONAL': { color: 'bg-yellow-500 text-white', label: 'Provisional' },
    'COTIZANDO': { color: 'bg-befast-success text-white', label: 'Cotizando' },

    // Classification statuses
    'Empleado Cotizante': { color: 'bg-befast-success text-white', label: 'Empleado Cotizante' },
    'Independiente': { color: 'bg-blue-500 text-white', label: 'Independiente' }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = statusConfig[status] || {
    color: 'bg-gray-500 text-white',
    label: status
  };

  const baseClasses = 'inline-flex items-center rounded-full font-medium';

  const variantClasses = variant === 'outline'
    ? 'border-2 bg-transparent'
    : config.color;

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses,
        sizes[size],
        className
      )}
    >
      {config.label}
    </span>
  );
};

export { StatusBadge };
