import React from 'react';
import type { OverviewReport } from '@/api/reports';

interface OverviewCardsProps {
  overview: OverviewReport | null;
  loading: boolean;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview, loading }) => {
  if (loading || !overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Asegurar que completion_rate es un número
  const completionRate = typeof overview.completion_rate === 'string' 
    ? parseFloat(overview.completion_rate) 
    : overview.completion_rate;

  const cards = [
    {
      title: 'Tareas Completadas',
      value: overview.completed_tasks,
      total: overview.total_tasks,
      icon: '✅',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Tareas Pendientes',
      value: overview.pending_tasks,
      total: overview.total_tasks,
      icon: '📅',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Tasa de Completitud',
      value: `${completionRate.toFixed(1)}%`,
      total: '100%',
      icon: '📊',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total de Tareas',
      value: overview.total_tasks,
      total: 'tareas',
      icon: '🎯',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow p-6 border border-gray-100`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div className={`${card.textColor} text-3xl font-bold`}>
            {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            de {card.total}
          </p>
        </div>
      ))}
    </div>
  );
};
