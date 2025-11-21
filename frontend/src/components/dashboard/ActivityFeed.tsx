import React from 'react';
import type { ActivityLog } from '@/api/reports';

interface ActivityFeedProps {
  activity: ActivityLog[];
  loading: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <p className="text-center text-gray-500 py-8">No hay actividad reciente</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return '✨';
      case 'updated':
        return '✏️';
      case 'completed':
        return '✅';
      case 'deleted':
        return '🗑️';
      case 'assigned':
        return '👤';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'bg-green-50 border-green-200';
      case 'updated':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'deleted':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'hace poco';
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    if (days < 7) return `hace ${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
      <div className="space-y-3">
        {activity.map((log) => (
          <div
            key={log.id}
            className={`border rounded-lg p-3 ${getActionColor(log.action)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1 flex-shrink-0">
                {getActionIcon(log.action)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {log.task_title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold">{log.changed_by}</span>
                  {' '}
                  <span className="lowercase">{log.action}</span>
                  {log.old_value && log.new_value && (
                    <>
                      {' '}de <span className="bg-white px-1 rounded">{log.old_value}</span>
                      {' '}a <span className="bg-white px-1 rounded">{log.new_value}</span>
                    </>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                {formatDate(log.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
