import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface BusinessUser {
  id: string;
  user_id?: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;
  status?: "active" | "pending" | "expired";
  invited_at?: string;
  accepted_at?: string;
  invite_token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InviteUserRequest {
  email: string;
  role_id: number;
}

export interface InviteResponse {
  message: string;
  invite_token: string;
  user: BusinessUser;
}

export interface UpdateUserRoleRequest {
  role_id: number;
}

/**
 * Get all users in the current business
 * @returns Array of business users
 */
export const getBusinessUsers = async (): Promise<BusinessUser[]> => {
  try {
    const response = await axios.get<ApiResponse<BusinessUser[]>>("/api/users");
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching business users:", error);
    throw {
      message: error.response?.data?.message || "Error fetching business users",
      status: error.response?.status,
    };
  }
};

/**
 * Invite a new user to the business
 * @param email - Email address to invite
 * @param roleId - Role ID for the new user
 * @returns Invite response with token
 */
export const inviteUser = async (
  email: string,
  roleId: number
): Promise<InviteResponse> => {
  try {
    if (!email || !roleId) {
      throw new Error("Email and Role ID are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const payload: InviteUserRequest = {
      email,
      role_id: roleId,
    };

    const response = await axios.post<ApiResponse<InviteResponse>>(
      "/api/users/invite",
      payload
    );

    if (!response.data.data) {
      throw new Error("Failed to send invitation");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error inviting user:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error sending invitation",
      status: error.response?.status,
    };
  }
};

/**
 * Remove a user from the business
 * @param userId - User ID to remove
 */
export const removeBusinessUser = async (userId: number | string): Promise<void> => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await axios.delete(`/api/users/${userId}`);
  } catch (error: any) {
    console.error("Error removing user:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error removing user",
      status: error.response?.status,
    };
  }
};

/**
 * Update a user's role in the business
 * @param userId - User ID
 * @param roleId - New role ID
 * @returns Updated user
 */
export const updateBusinessUserRole = async (
  userId: number | string,
  roleId: number
): Promise<BusinessUser> => {
  try {
    if (!userId || !roleId) {
      throw new Error("User ID and Role ID are required");
    }

    const payload: UpdateUserRoleRequest = {
      role_id: roleId,
    };

    const response = await axios.put<ApiResponse<BusinessUser>>(
      `/api/users/${userId}`,
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
        error.response?.data?.message || error.message || "Error updating user role",
      status: error.response?.status,
    };
  }
};

/**
 * Resend invite to a pending user
 * @param userId - User ID to resend invite
 */
export const resendInvite = async (userId: number | string): Promise<void> => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await axios.post(`/api/users/${userId}/resend-invite`, {});
  } catch (error: any) {
    console.error("Error resending invite:", error);
    throw {
      message: error.response?.data?.message || error.message || "Error resending invite",
      status: error.response?.status,
    };
  }
};

/**
 * Check if email is already invited or in business
 * @param email - Email to check
 * @returns True if email exists, false otherwise
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const users = await getBusinessUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  } catch {
    // If check fails, allow user to proceed (will catch on submit)
    return false;
  }
};
