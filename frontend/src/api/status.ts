import axios from "@/lib/axios";
import type { Status } from "@/types/task";

export interface StatusData {
  id: string;
  name: string;
  key: string; 
  description?: string;
  color: string; 
  order: number; 
  isDefault: boolean; 
  isActive: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStatusData {
  name: string;
  order: number;
  business_id?: number;
}

export interface UpdateStatusData {
  name?: string;
  order?: number;
}

export const getAllStatuses = async (): Promise<Status[]> => {
  const response = await axios.get("/api/status");
  const result = response.data.data || response.data || [];
  return result;
};

export const getStatusById = async (id: string): Promise<Status> => {
  const response = await axios.get(`/api/status/${id}`);
  return response.data.data || response.data;
};

export const createStatus = async (data: CreateStatusData): Promise<Status> => {
  const response = await axios.post("/api/status", data);
  return response.data.data || response.data;
};

export const updateStatus = async (id: string, data: UpdateStatusData): Promise<Status> => {
  const response = await axios.put(`/api/status/${id}`, data);
  return response.data.data || response.data;
};

export const deleteStatus = async (id: string): Promise<void> => {
  const response = await axios.delete(`/api/status/${id}`);
  return response.data;
};


export const getActiveStatuses = async (): Promise<Status[]> => {
  const response = await axios.get("/api/status/active");
  return response.data.data || [];
};

export const reorderStatuses = async (statusIds: string[]): Promise<Status[]> => {
  const response = await axios.put("/api/status/reorder", { statusIds });
  return response.data.data || [];
};
