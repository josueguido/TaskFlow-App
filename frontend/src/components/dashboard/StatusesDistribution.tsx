import React from 'react';
import type { StatusDistribution } from '@/api/reports';

interface StatusesDistributionProps {
  statuses: StatusDistribution[];
  loading: boolean;
}

export const StatusesDistribution: React.FC<StatusesDistributionProps> = ({
  statuses,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (statuses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
        <p className="text-center text-gray-500 py-8">No hay estados configurados</p>
      </div>
    );
  }

  // Convertir total_tasks a número
  const processedStatuses = statuses.map((status) => ({
    ...status,
    task_count: Number(status.total_tasks || 0),
  }));

  const totalTasks = processedStatuses.reduce((sum, s) => sum + s.task_count, 0);

  const statusColors: Record<string, string> = {
    'To Do': 'bg-red-500',
    'In Progress': 'bg-amber-500',
    'Done': 'bg-green-500',
    'Backlog': 'bg-blue-500',
    'Feature': 'bg-purple-500',
    'Bug': 'bg-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {processedStatuses.map((status, index) => {
              const startAngle = processedStatuses
                .slice(0, index)
                .reduce((sum, s) => sum + (s.task_count / totalTasks) * 360, 0);
              const sweepAngle = (status.task_count / totalTasks) * 360;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = ((startAngle + sweepAngle) * Math.PI) / 180;

              const startX = 50 + 40 * Math.cos(startRad);
              const startY = 50 + 40 * Math.sin(startRad);
              const endX = 50 + 40 * Math.cos(endRad);
              const endY = 50 + 40 * Math.sin(endRad);

              const largeArc = sweepAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${50} ${50}`,
                `L ${startX} ${startY}`,
                `A 40 40 0 ${largeArc} 1 ${endX} ${endY}`,
                'Z',
              ].join(' ');

              const color = statusColors[status.status_name] || 'bg-gray-500';
              const colorValue = color.replace('bg-', '');

              return (
                <path
                  key={status.status_id}
                  d={pathData}
                  fill={`var(--color-${colorValue})`}
                  style={{
                    fill: ['red', 'amber', 'green', 'blue', 'purple', 'yellow'].includes(
                      colorValue.split('-')[0]
                    )
                      ? `hsl(${index * (360 / processedStatuses.length)}, 70%, 50%)`
                      : '#ccc',
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              <p className="text-xs text-gray-500">tareas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {processedStatuses.map((status) => {
          const percentage = totalTasks > 0 ? ((status.task_count / totalTasks) * 100) : 0;
          return (
            <div key={status.status_id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['red', 'amber', 'green', 'blue', 'purple', 'yellow'].includes(
                      statusColors[status.status_name]?.replace('bg-', '').split('-')[0]
                    )
                      ? `hsl(${processedStatuses.indexOf(status) * (360 / processedStatuses.length)}, 70%, 50%)`
                      : '#ccc',
                  }}
                ></div>
                <span className="text-sm text-gray-700">{status.status_name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {status.task_count ?? 0} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
