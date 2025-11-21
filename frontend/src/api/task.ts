import axios from "@/lib/axios";
import type { User } from "@/types/user";

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  action: TaskHistoryAction;
  description: string;
  user: User;
  timestamp: Date;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
}

export type TaskHistoryAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'unassigned'
  | 'priority_changed'
  | 'due_date_changed'
  | 'comment_added'
  | 'attachment_added'
  | 'attachment_removed'
  | 'deleted';

export interface CreateTaskHistoryData {
  action: TaskHistoryAction;
  description: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
}

export const getTaskHistory = async (taskId: string): Promise<TaskHistoryEntry[]> => {
  const response = await axios.get(`/task/${taskId}/history`);
  return response.data;
};

export const addTaskHistoryEntry = async (
  taskId: string,
  data: CreateTaskHistoryData
): Promise<TaskHistoryEntry> => {
  const response = await axios.post(`/task/${taskId}/history`, data);
  return response.data;
};

export const getAllTaskHistory = async (): Promise<TaskHistoryEntry[]> => {
  const response = await axios.get("/task/history");
  return response.data;
};
