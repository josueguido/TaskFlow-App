import { useState, useEffect, useCallback } from 'react';
import * as statusApi from '../api/status';
import type { Status } from '../types/task';

export const useStatuses = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statusList = await statusApi.getAllStatuses();
      setStatuses(statusList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estados');
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const refetch = useCallback(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  return {
    statuses,
    loading,
    error,
    refetch
  };
};

export const useStatus = (statusId: string) => {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!statusId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedStatus = await statusApi.getStatusById(statusId);
      setStatus(fetchedStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estado');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [statusId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const refetch = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch
  };
};