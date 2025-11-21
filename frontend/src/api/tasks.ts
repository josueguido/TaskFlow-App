import axios from "../lib/axios";
import type { Task, TaskWithRelations, CreateTaskData, UpdateTaskData } from "../types/task";

export const getTasks = async (): Promise<TaskWithRelations[]> => {
  const response = await axios.get("/api/tasks");
  const result = response.data.data || response.data || [];
  return result;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await axios.get("/api/tasks?simple=true");
  return response.data.data || [];
};

export const getTaskById = async (id: number): Promise<TaskWithRelations> => {
  const response = await axios.get(`/api/tasks/${id}`);
  return response.data.data || response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await axios.post("/api/tasks", data);
  return response.data.data || response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  const response = await axios.put(`/api/tasks/${id}`, data);
  return response.data.data || response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`/api/tasks/${id}`);
};

export const changeTaskStatus = async (taskId: number, statusId: number): Promise<Task> => {
  const payload = { statusId: statusId };
  const response = await axios.patch(`/api/tasks/${taskId}/status`, payload);
  return response.data.data || response.data;
};

export const assignUserToTask = async (taskId: number, userId: number): Promise<void> => {
  await axios.post(`/api/tasks/${taskId}/assign`, { 
    user_id: userId 
  });
};

export const unassignUserFromTask = async (taskId: number, userId: number): Promise<void> => {
  await axios.delete(`/api/tasks/${taskId}/assign/${userId}`);
};

export const getTasksByStatus = async (statusId: number): Promise<TaskWithRelations[]> => {
  const response = await axios.get(`/api/tasks?status_id=${statusId}`);
  return response.data.data || [];
};

export const getTasksByUser = async (userId: number): Promise<TaskWithRelations[]> => {
  const response = await axios.get(`/api/tasks?assigned_to=${userId}`);
  return response.data.data || [];
};