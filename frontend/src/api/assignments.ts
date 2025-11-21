import axios from "@/lib/axios";
import type { User } from "@/types/user";
import type { Task } from "@/types/task";

export interface Assignment {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  task: Task;
  assignedBy: User;
  assignedAt: Date;
  role?: AssignmentRole;
  isActive: boolean;
}

export type AssignmentRole = 'owner' | 'collaborator' | 'reviewer' | 'observer';

export interface AssignTaskData {
  userIds: string[];
  role?: AssignmentRole;
}

export interface AssignmentSummary {
  taskId: string;
  totalAssignees: number;
  assignments: Assignment[];
}

export interface UserTaskAssignment {
  isAssigned: boolean;
  assignment?: Assignment;
}

export const getAllAssignments = async (): Promise<Assignment[]> => {
  const response = await axios.get("/assignments");
  return response.data;
};

export const getTaskAssignments = async (taskId: string): Promise<AssignmentSummary> => {
  const response = await axios.get(`/assignments/task/${taskId}`);
  return response.data;
};

export const assignUsersToTask = async (
  taskId: string, 
  data: AssignTaskData
): Promise<Assignment[]> => {
  const response = await axios.post(`/assignments/task/${taskId}/assign`, data);
  return response.data;
};

export const removeUserAssignment = async (
  taskId: string, 
  userId: string
): Promise<void> => {
  const response = await axios.delete(`/assignments/task/${taskId}/user/${userId}`);
  return response.data;
};

export const removeAllTaskAssignments = async (taskId: string): Promise<void> => {
  const response = await axios.delete(`/assignments/task/${taskId}`);
  return response.data;
};

export const checkUserAssignment = async (
  taskId: string, 
  userId: string
): Promise<UserTaskAssignment> => {
  const response = await axios.get(`/assignments/task/${taskId}/user/${userId}`);
  return response.data;
};


export const getUserAssignments = async (userId: string): Promise<Assignment[]> => {
  const response = await axios.get(`/assignments/user/${userId}`);
  return response.data;
};

export const updateAssignmentRole = async (
  assignmentId: string, 
  role: AssignmentRole
): Promise<Assignment> => {
  const response = await axios.put(`/assignments/${assignmentId}/role`, { role });
  return response.data;
};

export const bulkAssignTasks = async (data: {
  taskIds: string[];
  userIds: string[];
  role?: AssignmentRole;
}): Promise<Assignment[]> => {
  const response = await axios.post("/assignments/bulk", data);
  return response.data;
};
