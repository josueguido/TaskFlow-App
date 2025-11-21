import { useState, useCallback } from 'react';
import {
  getProjectUsers,
  getMyProjectRole,
  addUserToProject,
  removeUserFromProject,
  updateProjectUserRole,
  type ProjectUser,
  type UserRole,
} from '@/api/projectUsers';

interface UseProjectUsersReturn {
  projectUsers: ProjectUser[];
  currentUserRole: UserRole | null;
  loading: boolean;
  error: string | null;
  fetchUsers: (projectId: number) => Promise<void>;
  addUser: (projectId: number, userId: number, roleId: number) => Promise<void>;
  removeUser: (projectId: number, userId: number) => Promise<void>;
  updateUserRole: (projectId: number, userId: number, roleId: number) => Promise<void>;
}

export const useProjectUsers = (): UseProjectUsersReturn => {
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);

      const [users, role] = await Promise.all([
        getProjectUsers(projectId),
        getMyProjectRole(projectId),
      ]);

      setProjectUsers(users);
      setCurrentUserRole(role);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch project users';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(
    async (projectId: number, userId: number, roleId: number) => {
      try {
        setError(null);
        await addUserToProject(projectId, userId, roleId);
        // Refetch users
        await fetchUsers(projectId);
      } catch (err: any) {
        const message = err.message || 'Failed to add user';
        setError(message);
        throw err;
      }
    },
    [fetchUsers]
  );

  const removeUser = useCallback(
    async (projectId: number, userId: number) => {
      try {
        setError(null);
        await removeUserFromProject(projectId, userId);
        // Update local state
        setProjectUsers((prev) => prev.filter((u) => u.user_id !== userId));
      } catch (err: any) {
        const message = err.message || 'Failed to remove user';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateUserRole = useCallback(
    async (projectId: number, userId: number, roleId: number) => {
      try {
        setError(null);
        await updateProjectUserRole(projectId, userId, roleId);
        // Refetch users to get updated data
        await fetchUsers(projectId);
      } catch (err: any) {
        const message = err.message || 'Failed to update user role';
        setError(message);
        throw err;
      }
    },
    [fetchUsers]
  );

  return {
    projectUsers,
    currentUserRole,
    loading,
    error,
    fetchUsers,
    addUser,
    removeUser,
    updateUserRole,
  };
};
