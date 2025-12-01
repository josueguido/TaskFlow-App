import axios from "../lib/axios";
import type { Task, TaskWithRelations, CreateTaskData, UpdateTaskData } from "../types/task";

export const getTasks = async (): Promise<TaskWithRelations[]> => {
  const response = await axios.get("/tasks");
  const result = response.data.data || response.data || [];
  return result;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await axios.get("/tasks?simple=true");
  return response.data.data || [];
};

export const getTaskById = async (id: number): Promise<TaskWithRelations> => {
  const response = await axios.get(`/tasks/${id}`);
  return response.data.data || response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  // Convertir status_id a string ya que el backend lo espera así
  const payload = {
    ...data,
    status_id: String(data.status_id)
  };
  const response = await axios.post("/tasks", payload);
  return response.data.data || response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  // Convertir status_id a string ya que el backend lo espera así
  const payload = {
    ...data,
    ...(data.status_id && { status_id: String(data.status_id) })
  };
  const response = await axios.put(`/tasks/${id}`, payload);
  return response.data.data || response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`/tasks/${id}`);
};

export const changeTaskStatus = async (taskId: number, statusId: number): Promise<Task> => {
  const payload = { statusId: statusId };
  const response = await axios.patch(`/tasks/${taskId}/status`, payload);
  return response.data.data || response.data;
};

export const assignUserToTask = async (taskId: number, userId: number): Promise<void> => {
  await axios.post(`/tasks/${taskId}/assign`, { 
    user_id: userId 
  });
};

export const unassignUserFromTask = async (taskId: number, userId: number): Promise<void> => {
  await axios.delete(`/tasks/${taskId}/assign/${userId}`);
};

export const getTasksByStatus = async (statusId: number): Promise<TaskWithRelations[]> => {
  const response = await axios.get(`/tasks?status_id=${statusId}`);
  return response.data.data || [];
};

export const getTasksByUser = async (userId: number): Promise<TaskWithRelations[]> => {
  const response = await axios.get(`/tasks?assigned_to=${userId}`);
  return response.data.data || [];
};