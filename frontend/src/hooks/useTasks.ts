import { useState, useEffect, useCallback } from 'react';
import * as tasksApi from '../api/tasks';
import type { Task, TaskWithRelations, CreateTaskData, UpdateTaskData } from '../types/task';

export const useTasks = (projectId?: number) => {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksList = await tasksApi.getTasks();
      
      // Filtrar por projectId si se proporciona
      const filtered = projectId 
        ? tasksList.filter((task: TaskWithRelations) => task.project_id === projectId)
        : tasksList;
      
      setTasks(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refetch = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch
  };
};

export const useTask = (taskId: number) => {
  const [task, setTask] = useState<TaskWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedTask = await tasksApi.getTaskById(taskId);
      setTask(fetchedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tarea');
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const refetch = useCallback(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    task,
    loading,
    error,
    refetch
  };
};

export const useTaskMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await tasksApi.createTask(taskData);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: number, updates: UpdateTaskData): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await tasksApi.updateTask(taskId, updates);
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await tasksApi.deleteTask(taskId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = useCallback(async (taskId: number, statusId: number): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await tasksApi.changeTaskStatus(taskId, statusId);
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignUser = useCallback(async (taskId: number, userId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await tasksApi.assignUserToTask(taskId, userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unassignUser = useCallback(async (taskId: number, userId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await tasksApi.unassignUserFromTask(taskId, userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desasignar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    changeStatus,
    assignUser,
    unassignUser,
    loading,
    error
  };
};