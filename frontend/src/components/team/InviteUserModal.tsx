import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader, CheckCircle } from 'lucide-react';
import { inviteUser, checkEmailExists } from '@/api/businessUsers';
import { getAvailableRoles, type Role } from '@/api/roles';

const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Please select a role'),
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteUserForm>({
    resolver: zodResolver(inviteUserSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const availableRoles = await getAvailableRoles();
        setRoles(availableRoles);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setError('Error loading roles');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [isOpen]);

  const onSubmit = async (data: InviteUserForm) => {
    try {
      setLoading(true);
      setError(null);

      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        setError('This email is already a member of the business');
        setLoading(false);
        return;
      }

      await inviteUser(data.email, Number(data.roleId));

      setSuccessMessage(`Invitation sent to ${data.email}`);
      reset();

      setTimeout(() => {
        reset();
        setSuccessMessage(null);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error inviting user:', err);
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !successMessage) {
      reset();
      setError(null);
      setSuccessMessage(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
          <button
            onClick={handleClose}
            disabled={loading || !!successMessage}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 font-medium">Success!</p>
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="user@example.com"
              disabled={loading || !!successMessage || rolesLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
              disabled={loading || !!successMessage || rolesLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.roleId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Choose a role...</option>
              {rolesLoading ? (
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

          {!successMessage && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rolesLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
