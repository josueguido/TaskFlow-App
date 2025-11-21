import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Project } from "@/api/projects";
import type { BusinessData } from "@/types/api";

export interface SwitchTenantRequest {
  business_id: number;
}

/**
 * Get all businesses/tenants for current user
 * @returns Array of businesses
 */
export const getMyBusinesses = async (): Promise<BusinessData[]> => {
  try {
    const response = await axios.get<ApiResponse<BusinessData[]>>(
      "/api/projects/me/all"
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching businesses:", error);
    throw {
      message: error.response?.data?.message || "Error fetching businesses",
      status: error.response?.status,
    };
  }
};

/**
 * Get current business information
 * @returns Current business details
 */
export const getCurrentBusiness = async (): Promise<BusinessData> => {
  try {
    const response = await axios.get<ApiResponse<BusinessData>>(
      "/api/businesses/me"
    );

    if (!response.data.data) {
      throw new Error("Failed to fetch current business");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching current business:", error);
    throw {
      message:
        error.response?.data?.message || "Error fetching current business",
      status: error.response?.status,
    };
  }
};

/**
 * Switch to a different business/tenant
 * @param businessId - Business ID to switch to
 * @returns New business details
 */
export const switchBusiness = async (businessId: number): Promise<BusinessData> => {
  try {
    if (!businessId) {
      throw new Error("Business ID is required");
    }

    const payload: SwitchTenantRequest = {
      business_id: businessId,
    };

    const response = await axios.post<ApiResponse<BusinessData>>(
      "/api/auth/switch-tenant",
      payload
    );

    if (!response.data.data) {
      throw new Error("Failed to switch business");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error switching business:", error);
    throw {
      message:
        error.response?.data?.message || error.message || "Error switching business",
      status: error.response?.status,
    };
  }
};

/**
 * Get user's projects for current business
 * @returns Array of projects
 */
export const getMyProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get<ApiResponse<Project[]>>(
      "/api/projects/me/all"
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    throw {
      message: error.response?.data?.message || "Error fetching projects",
      status: error.response?.status,
    };
  }
};
