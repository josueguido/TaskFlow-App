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
  const response = await axios.get("/status");
  const result = response.data.data || response.data || [];
  return result;
};

export const getStatusById = async (id: string): Promise<Status> => {
  const response = await axios.get(`/status/${id}`);
  return response.data.data || response.data;
};

export const createStatus = async (data: CreateStatusData): Promise<Status> => {
  const response = await axios.post("/status", data);
  return response.data.data || response.data;
};

export const updateStatus = async (id: string, data: UpdateStatusData): Promise<Status> => {
  const response = await axios.put(`/status/${id}`, data);
  return response.data.data || response.data;
};

export const deleteStatus = async (id: string): Promise<void> => {
  const response = await axios.delete(`/status/${id}`);
  return response.data;
};


export const getActiveStatuses = async (): Promise<Status[]> => {
  const response = await axios.get("/status/active");
  return response.data.data || [];
};

export const reorderStatuses = async (statusIds: string[]): Promise<Status[]> => {
  const response = await axios.put("/status/reorder", { statusIds });
  return response.data.data || [];
};
