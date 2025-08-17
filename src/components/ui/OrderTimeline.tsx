import React from 'react';

interface TimelineEvent {
  label: string;
  timestamp: string;
  status: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const statusColors: Record<string, string> = {
  created: 'bg-gray-400',
  assigned: 'bg-blue-400',
  on_the_way: 'bg-yellow-400',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  return (
    <ol className="relative border-l border-gray-200 animate-fade-in">
      {events.length === 0 && (
        <li className="ml-6 text-gray-400 text-sm">Sin eventos aún.</li>
      )}
      {events.map((event, idx) => (
        <li key={idx} className="mb-6 ml-6 group">
          <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white ${statusColors[event.status] || 'bg-gray-300'} transition-all group-hover:scale-110`} />
          <div className="flex flex-col">
            <span className="font-semibold text-befast-primary group-hover:underline transition">{event.label}</span>
            <span className="text-xs text-gray-500">{event.timestamp}</span>
          </div>
        </li>
      ))}
    </ol>
  );
};
