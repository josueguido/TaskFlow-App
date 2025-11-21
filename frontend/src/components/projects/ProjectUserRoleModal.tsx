import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { updateProjectUserRole } from '@/api/projectUsers';
import { getAvailableRoles, type Role } from '@/api/roles';
import type { ProjectUser } from '@/api/projectUsers';

interface ProjectUserRoleModalProps {
  isOpen: boolean;
  user: ProjectUser | null;
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
  isLastAdmin?: boolean;
}

export const ProjectUserRoleModal: React.FC<ProjectUserRoleModalProps> = ({
  isOpen,
  user,
  projectId,
  onClose,
  onSuccess,
  isLastAdmin = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | number>('');
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const availableRoles = await getAvailableRoles();
        setRoles(availableRoles);
        setSelectedRoleId(user.role_id);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setError('Error loading roles');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || selectedRoleId === user.role_id) {
      onClose();
      return;
    }

    const isAdminRole = roles.find(r => r.id === user.role_id)?.name?.toLowerCase() === 'admin';
    if (isAdminRole && isLastAdmin) {
      setError('Cannot change role of the last project admin');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateProjectUserRole(projectId, Number(user.user_id), Number(selectedRoleId));

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(err.message || 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const currentRole = roles.find(r => r.id === user.role_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Change User Role</h2>
          <button
            onClick={onClose}
            disabled={loading || rolesLoading}
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

        {isLastAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ This is the last project admin. Changing this role may affect project management.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">User:</span> {user.name} ({user.email})
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Current Role:</span> {currentRole?.name || 'Unknown'}
            </p>
          </div>

          <div>
            <label
              htmlFor="roleId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select New Role
            </label>
            <div className="space-y-2">
              {rolesLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader size={16} className="animate-spin" />
                  <span>Loading roles...</span>
                </div>
              ) : (
                roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="roleId"
                      value={role.id}
                      checked={selectedRoleId === role.id}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      disabled={loading}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{role.name}</p>
                      {role.description && (
                        <p className="text-sm text-gray-500">{role.description}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || rolesLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rolesLoading || selectedRoleId === user.role_id}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Updating...' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
