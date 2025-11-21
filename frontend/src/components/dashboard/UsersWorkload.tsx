import React from 'react';
import type { UserWorkload } from '@/api/reports';

interface UsersWorkloadProps {
  users: UserWorkload[];
  loading: boolean;
}

export const UsersWorkload: React.FC<UsersWorkloadProps> = ({ users, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo</h3>
        <p className="text-center text-gray-500 py-8">No hay usuarios con tareas asignadas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo por Usuario</h3>
      <div className="space-y-4">
        {users.map((user) => {
          const totalAssigned = Number(user.total_assigned);
          const completed = Number(user.completed);
          const completionRate =
            totalAssigned > 0
              ? Math.round((completed / totalAssigned) * 100)
              : 0;

          return (
            <div key={user.user_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{user.user_name}</h4>
                <span className="text-sm font-semibold text-gray-600">
                  {completionRate}% completado
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  ✅ {completed} completadas
                </span>
                <span>
                  📅 {Number(user.pending)} pendientes
                </span>
                <span>
                  🎯 {totalAssigned} total
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
