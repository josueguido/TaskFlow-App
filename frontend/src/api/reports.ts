import axios from "@/lib/axios";

export interface OverviewReport {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

export interface ProjectReport {
  project_id: number;
  project_name: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
}

export interface ActivityLog {
  id: number;
  task_id: number;
  task_title: string;
  action: string;
  changed_by: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface UserWorkload {
  user_id: number;
  user_name: string;
  email: string;
  total_assigned: string | number;
  completed: string | number;
  pending: string | number;
}

export interface StatusDistribution {
  status_id: number;
  status_name: string;
  total_tasks: string | number;
  order: number;
  task_count?: number;
  percentage?: string | number;
}

export interface CombinedReport {
  overview: OverviewReport;
  projects: ProjectReport[];
  activity: ActivityLog[];
  users: UserWorkload[];
  statuses: StatusDistribution[];
}

// Overview - Resumen general
export const getOverviewReport = async (): Promise<OverviewReport> => {
  const response = await axios.get("/reports/overview");
  return response.data.data || response.data;
};

// Projects - Progreso por proyecto
export const getProjectsReport = async (): Promise<ProjectReport[]> => {
  const response = await axios.get("/reports/projects");
  return response.data.data || [];
};

// Activity - Últimos cambios
export const getActivityReport = async (): Promise<ActivityLog[]> => {
  const response = await axios.get("/reports/activity");
  return response.data.data || [];
};

// Users - Carga de trabajo por usuario
export const getUsersReport = async (): Promise<UserWorkload[]> => {
  const response = await axios.get("/reports/users");
  return response.data.data || [];
};

// Statuses - Distribución por estado
export const getStatusesReport = async (): Promise<StatusDistribution[]> => {
  const response = await axios.get("/reports/statuses");
  return response.data.data || [];
};

// Combined - Todo junto
export const getCombinedReport = async (): Promise<CombinedReport> => {
  const response = await axios.get("/reports/combined");
  const data = response.data.data || response.data;
  
  // Convertir strings a números
  if (data.overview) {
    data.overview = {
      ...data.overview,
      total_tasks: Number(data.overview.total_tasks),
      completed_tasks: Number(data.overview.completed_tasks),
      pending_tasks: Number(data.overview.pending_tasks),
      completion_rate: Number(data.overview.completion_rate),
    };
  }
  
  if (data.projects) {
    data.projects = data.projects.map((p: any) => ({
      ...p,
      total_tasks: Number(p.total_tasks),
      completed_tasks: Number(p.completed_tasks),
      completion_rate: p.completion_rate === null ? null : Number(p.completion_rate),
    }));
  }
  
  if (data.users) {
    data.users = data.users.map((u: any) => ({
      ...u,
      assigned_tasks: Number(u.assigned_tasks),
      completed_tasks: Number(u.completed_tasks),
      pending_tasks: Number(u.pending_tasks),
    }));
  }
  
  return data;
};
