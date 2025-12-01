import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface ProjectUser {
  id?: string;
  user_id: number;
  project_id: number;
  role_id: number;
  name: string;
  email: string;
  roleName?: string;
  addedAt?: string;
  created_at?: string;
}

export interface UserRole {
  role_id: number;
  role_name: string;
  permissions?: string[];
}

export interface AddProjectUserRequest {
  user_id: number;
  role_id: number;
}

export interface UpdateProjectUserRoleRequest {
  role_id: number;
}


export const getProjectUsers = async (projectId: number): Promise<ProjectUser[]> => {
  try {
    const response = await axios.get<ApiResponse<ProjectUser[]>>(
      `/projects/${projectId}/users`
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching project users:", error);
    throw {
      message: error.response?.data?.message || "Error fetching project users",
      status: error.response?.status,
    };
  }
};


export const addUserToProject = async (
  projectId: number,
  userId: number,
  roleId: number
): Promise<ProjectUser> => {
  try {
    if (!projectId || !userId || !roleId) {
      throw new Error("Project ID, User ID, and Role ID are required");
    }

    const payload: AddProjectUserRequest = {
      user_id: userId,
      role_id: roleId,
    };

    const response = await axios.post<ApiResponse<ProjectUser>>(
      `/projects/${projectId}/users`,
      payload
    );

    if (!response.data.data) {
      throw new Error("Failed to add user to project");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error adding user to project:", error);
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error adding user to project",
      status: error.response?.status,
    };
  }
};


export const removeUserFromProject = async (
  projectId: number,
  userId: number
): Promise<void> => {
  try {
    if (!projectId || !userId) {
      throw new Error("Project ID and User ID are required");
    }

    await axios.delete(`/projects/${projectId}/users/${userId}`);
  } catch (error: any) {
    console.error("Error removing user from project:", error);
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error removing user from project",
      status: error.response?.status,
    };
  }
};


export const updateProjectUserRole = async (
  projectId: number,
  userId: number,
  roleId: number
): Promise<ProjectUser> => {
  try {
    if (!projectId || !userId || !roleId) {
      throw new Error("Project ID, User ID, and Role ID are required");
    }

    const payload: UpdateProjectUserRoleRequest = {
      role_id: roleId,
    };

    const response = await axios.put<ApiResponse<ProjectUser>>(
      `/projects/${projectId}/users/${userId}`,
      payload
    );

    if (!response.data.data) {
      throw new Error("Failed to update user role");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error updating user role",
      status: error.response?.status,
    };
  }
};


export const getMyProjectRole = async (projectId: number): Promise<UserRole> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await axios.get<ApiResponse<UserRole>>(
      `/projects/${projectId}/users/me/role`
    );

    if (!response.data.data) {
      throw new Error("Failed to fetch user role");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user role:", error);
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error fetching your role in this project",
      status: error.response?.status,
    };
  }
};
