import React from 'react';
import type { ProjectReport } from '@/api/reports';

interface ProjectsChartProps {
  projects: ProjectReport[];
  loading: boolean;
}

export const ProjectsChart: React.FC<ProjectsChartProps> = ({ projects, loading }) => {
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

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Project</h3>
        <p className="text-center text-gray-500 py-8">No projects available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Proyecto</h3>
      <div className="space-y-4">
        {projects.map((project) => {
          const completionRate = project.completion_rate === null || project.completion_rate === undefined
            ? 0
            : typeof project.completion_rate === 'string' 
              ? parseFloat(project.completion_rate) 
              : project.completion_rate;

          return (
            <div key={project.project_id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{project.project_name}</h4>
                <span className="text-sm font-semibold text-blue-600">
                  {completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(completionRate, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {project.completed_tasks} / {project.total_tasks} tasks completed
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
