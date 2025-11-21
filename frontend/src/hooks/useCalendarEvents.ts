import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';

export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  due_date: string; 
  project_id: number;
  status_name: string;
  project_name: string;
  assigned_users: string[];
  assigned_user_ids: number[];
  created_at: string;
  updated_at: string;
  start?: Date;
  end?: Date;
}

interface CalendarEventsResponse {
  success: boolean;
  message: string;
  data: CalendarEvent[];
}

export const useCalendarEvents = (projectId?: number) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = projectId ? { projectId } : {};
      const response = await axios.get<CalendarEventsResponse>('/api/tasks/calendar', { params });

      if (response.data.success) {
        const transformedEvents = response.data.data.map((event) => ({
          ...event,
          start: new Date(event.due_date),
          end: new Date(event.due_date),
        }));

        setEvents(transformedEvents);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching calendar events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch,
  };
};
