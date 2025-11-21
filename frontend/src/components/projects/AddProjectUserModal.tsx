import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader } from 'lucide-react';
import { addUserToProject } from '@/api/projectUsers';
import { getBusinessUsers } from '@/api/businessUsers';
import { getAvailableRoles, type Role } from '@/api/roles';
import type { BusinessUser } from '@/api/businessUsers';

const addUserSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),
  roleId: z.string().min(1, 'Please select a role'),
});

type AddUserForm = z.infer<typeof addUserSchema>;

interface AddProjectUserModalProps {
  isOpen: boolean;
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
  existingUserIds?: number[];
}

export const AddProjectUserModal: React.FC<AddProjectUserModalProps> = ({
  isOpen,
  projectId,
  onClose,
  onSuccess,
  existingUserIds = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setUsersLoading(true);
        const [users, availableRoles] = await Promise.all([
          getBusinessUsers(),
          getAvailableRoles(),
        ]);
        setBusinessUsers(users);
        setRoles(availableRoles);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Error loading users and roles');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const availableUsers = businessUsers.filter(
    (user) => !existingUserIds.includes(Number(user.user_id || user.id))
  );

  const onSubmit = async (data: AddUserForm) => {
    try {
      setLoading(true);
      setError(null);

      await addUserToProject(
        projectId,
        Number(data.userId),
        Number(data.roleId)
      );

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'Failed to add user to project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
          <button
            onClick={onClose}
            disabled={loading || usersLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {availableUsers.length === 0 && !usersLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              All business users are already members of this project
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select User
            </label>
            <select
              {...register('userId')}
              id="userId"
              disabled={loading || usersLoading || availableUsers.length === 0}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.userId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Choose a user...</option>
              {usersLoading ? (
                <option disabled>Loading users...</option>
              ) : (
                availableUsers.map((user) => (
                  <option key={user.id || user.user_id} value={user.user_id || user.id}>
                    {user.name} ({user.email})
                  </option>
                ))
              )}
            </select>
            {errors.userId && (
              <p className="mt-1 text-sm text-red-500">{errors.userId.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="roleId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              {...register('roleId')}
              id="roleId"
              disabled={loading || usersLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.roleId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Choose a role...</option>
              {usersLoading ? (
                <option disabled>Loading roles...</option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
            {errors.roleId && (
              <p className="mt-1 text-sm text-red-500">{errors.roleId.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || usersLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || usersLoading || availableUsers.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
