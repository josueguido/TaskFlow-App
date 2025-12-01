import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface Project {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectDTO {
  businessId: number;
  name: string;
  description?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

export interface ProjectStats {
  total_projects: string;
  recent_projects: string;
}

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get<ApiResponse<Project[]>>("/projects");
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    throw {
      message: error.response?.data?.message || "Error fetching projects",
      status: error.response?.status
    };
  }
};

export const getProjectById = async (projectId: string): Promise<Project> => {
  try {
    const response = await axios.get<ApiResponse<Project>>(
      `/projects/${projectId}`
    );
    if (!response.data.data) {
      throw new Error("Project not found");
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching project:", error);
    throw {
      message: error.response?.data?.message || "Error fetching project",
      status: error.response?.status
    };
  }
};

export const createProject = async (data: CreateProjectDTO): Promise<Project> => {
  try {
    if (!data.businessId || !data.name) {
      throw new Error("businessId y name son requeridos");
    }

    if (data.name.length > 255) {
      throw new Error("El nombre no puede exceder 255 caracteres");
    }

    if (data.description && data.description.length > 1000) {
      throw new Error("La descripción no puede exceder 1000 caracteres");
    }

    const payload: any = {
      businessId: Number(data.businessId),
      name: data.name,
    };
    
    if (data.description) {
      payload.description = data.description;
    }
    
    const response = await axios.post<ApiResponse<Project>>(
      "/projects",
      payload
    );
    
    if (!response.data.data) {
      throw new Error("Failed to create project");
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating project:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error creating project",
      status: error.response?.status
    };
  }
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectDTO
): Promise<Project> => {
  try {
    if (!data.name && !data.description) {
      throw new Error("Al menos uno de estos campos es requerido: name, description");
    }

    if (data.name && data.name.length > 255) {
      throw new Error("El nombre no puede exceder 255 caracteres");
    }

    if (data.description && data.description.length > 1000) {
      throw new Error("La descripción no puede exceder 1000 caracteres");
    }

    const response = await axios.put<ApiResponse<Project>>(
      `/projects/${projectId}`,
      data
    );
    if (!response.data.data) {
      throw new Error("Failed to update project");
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error updating project:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error updating project",
      status: error.response?.status
    };
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await axios.delete(`/projects/${projectId}`);
  } catch (error: any) {
    console.error("Error deleting project:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error deleting project",
      status: error.response?.status
    };
  }
};

export const getProjectsByBusiness = async (businessId: string): Promise<Project[]> => {
  try {
    const response = await axios.get<ApiResponse<Project[]>>(
      `/projects/business/${businessId}`
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching projects by business:", error);
    throw {
      message: error.response?.data?.message || "Error fetching projects",
      status: error.response?.status
    };
  }
};

export const getProjectStats = async (businessId: string): Promise<ProjectStats> => {
  try {
    const response = await axios.get<ApiResponse<ProjectStats>>(
      `/projects/business/${businessId}/stats`
    );
    if (!response.data.data) {
      throw new Error("Failed to fetch project stats");
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching project stats:", error);
    throw {
      message: error.response?.data?.message || "Error fetching project statistics",
      status: error.response?.status
    };
  }
};

