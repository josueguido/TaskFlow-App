import axios from "@/lib/axios";

export interface Role {
  id: string | number;
  name: string;
  description?: string;
  permissions?: Permission[];
  isSystem?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string; 
  action: PermissionAction; 
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'admin';

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[]; 
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[]; 
}

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await axios.get("/roles");
  return response.data;
};

export const getAvailableRoles = async (): Promise<Role[]> => {
  try {
    const response = await axios.get("/roles");
    return response.data.data || response.data || [];
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    throw {
      message: error.response?.data?.message || "Error fetching roles",
      status: error.response?.status,
    };
  }
};

export const getRoleById = async (id: string): Promise<Role> => {
  const response = await axios.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (data: CreateRoleData): Promise<Role> => {
  const response = await axios.post("/roles", data);
  return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleData): Promise<Role> => {
  const response = await axios.put(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  const response = await axios.delete(`/roles/${id}`);
  return response.data;
};


export const getAllPermissions = async (): Promise<Permission[]> => {
  const response = await axios.get("/permissions");
  return response.data;
};
