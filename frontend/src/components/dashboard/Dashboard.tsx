import React, { useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { OverviewCards } from './OverviewCards';
import { ProjectsChart } from './ProjectsChart';
import { ActivityFeed } from './ActivityFeed';
import { UsersWorkload } from './UsersWorkload';
import { StatusesDistribution } from './StatusesDistribution';

export const Dashboard: React.FC = () => {
  const { overview, projects, activity, users, statuses, loading, error, fetchCombinedReport } =
    useReports();

  useEffect(() => {
    fetchCombinedReport();
  }, [fetchCombinedReport]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error al cargar el dashboard</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => fetchCombinedReport()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general de tu negocio</p>
        </div>

        {/* Overview Cards */}
        <div className="mb-8">
          <OverviewCards overview={overview} loading={loading} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
          {/* Left Column - Projects & Statuses */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectsChart projects={projects} loading={loading} />
            <ActivityFeed activity={activity} loading={loading} />
          </div>

          {/* Right Column - Users & Statuses */}
          <div className="space-y-8">
            <StatusesDistribution statuses={statuses} loading={loading} />
            <UsersWorkload users={users} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};
