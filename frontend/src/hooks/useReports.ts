import { useState, useCallback } from 'react';
import {
  getOverviewReport,
  getProjectsReport,
  getActivityReport,
  getUsersReport,
  getStatusesReport,
  getCombinedReport,
  type OverviewReport,
  type ProjectReport,
  type ActivityLog,
  type UserWorkload,
  type StatusDistribution,
} from '@/api/reports';

interface UseReportsState {
  overview: OverviewReport | null;
  projects: ProjectReport[];
  activity: ActivityLog[];
  users: UserWorkload[];
  statuses: StatusDistribution[];
  loading: boolean;
  error: string | null;
}

export const useReports = () => {
  const [state, setState] = useState<UseReportsState>({
    overview: null,
    projects: [],
    activity: [],
    users: [],
    statuses: [],
    loading: false,
    error: null,
  });

  const fetchCombinedReport = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getCombinedReport();
      setState({
        overview: data.overview,
        projects: data.projects,
        activity: data.activity,
        users: data.users,
        statuses: data.statuses,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Error al cargar reportes',
      }));
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      const data = await getOverviewReport();
      setState((prev) => ({ ...prev, overview: data }));
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjectsReport();
      setState((prev) => ({ ...prev, projects: data }));
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const data = await getActivityReport();
      setState((prev) => ({ ...prev, activity: data }));
    } catch (err) {
      console.error('Error fetching activity:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsersReport();
      setState((prev) => ({ ...prev, users: data }));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await getStatusesReport();
      setState((prev) => ({ ...prev, statuses: data }));
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  }, []);

  return {
    ...state,
    fetchCombinedReport,
    fetchOverview,
    fetchProjects,
    fetchActivity,
    fetchUsers,
    fetchStatuses,
    refetch: fetchCombinedReport,
  };
};
