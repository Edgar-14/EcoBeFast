import React from 'react';

interface OrderMapProps {
  coordinates?: { lat: number; lng: number };
  shipday?: { trackingUrl?: string };
}

export const OrderMap: React.FC<OrderMapProps> = ({ coordinates, shipday }) => {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 animate-fade-in">
      {coordinates && coordinates.lat && coordinates.lng ? (
        <iframe
          title="Ubicación de entrega"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
        />
      ) : shipday?.trackingUrl ? (
        <a
          href={shipday.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-befast-primary underline"
        >
          Ver seguimiento en Shipday
        </a>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">Sin ubicación disponible</div>
      )}
    </div>
  );
};
