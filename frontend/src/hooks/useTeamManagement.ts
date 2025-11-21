import { useState, useCallback } from 'react';
import {
  getBusinessUsers,
  inviteUser,
  removeBusinessUser,
  updateBusinessUserRole,
  resendInvite,
  type BusinessUser,
} from '@/api/businessUsers';

interface UseTeamManagementReturn {
  businessUsers: BusinessUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  inviteNewUser: (email: string, roleId: number) => Promise<void>;
  removeUser: (userId: string | number) => Promise<void>;
  updateUserRole: (userId: string | number, roleId: number) => Promise<void>;
  resendUserInvite: (userId: string | number) => Promise<void>;
}

export const useTeamManagement = (): UseTeamManagementReturn => {
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await getBusinessUsers();
      setBusinessUsers(users);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch business users';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteNewUser = useCallback(async (email: string, roleId: number) => {
    try {
      setError(null);
      await inviteUser(email, roleId);
      await fetchUsers();
    } catch (err: any) {
      const message = err.message || 'Failed to invite user';
      setError(message);
      throw err;
    }
  }, [fetchUsers]);

  const removeUser = useCallback(async (userId: string | number) => {
    try {
      setError(null);
      await removeBusinessUser(userId);
      setBusinessUsers((prev) => 
        prev.filter((u) => (u.id || u.user_id) !== userId)
      );
    } catch (err: any) {
      const message = err.message || 'Failed to remove user';
      setError(message);
      throw err;
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string | number, roleId: number) => {
    try {
      setError(null);
      await updateBusinessUserRole(userId, roleId);
      setBusinessUsers((prev) =>
        prev.map((u) =>
          (u.id || u.user_id) === userId ? { ...u, role_id: roleId } : u
        )
      );
    } catch (err: any) {
      const message = err.message || 'Failed to update user role';
      setError(message);
      throw err;
    }
  }, []);

  const resendUserInvite = useCallback(async (userId: string | number) => {
    try {
      setError(null);
      await resendInvite(userId);
      await fetchUsers();
    } catch (err: any) {
      const message = err.message || 'Failed to resend invite';
      setError(message);
      throw err;
    }
  }, [fetchUsers]);

  return {
    businessUsers,
    loading,
    error,
    fetchUsers,
    inviteNewUser,
    removeUser,
    updateUserRole,
    resendUserInvite,
  };
};
