import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userManagementService } from '../../services/authService';
import { UserPlus, Mail, Users, AlertCircle, CheckCircle } from 'lucide-react';

// Schema de validación
const inviteUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email cannot exceed 255 characters'),
  role_id: z
    .number()
    .min(1, 'You must select a role')
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;

const ROLES = [
  { id: 1, name: 'Administrator', description: 'Full system access' },
  { id: 2, name: 'Employee', description: 'Access to assigned tasks and projects' },
  { id: 3, name: 'Viewer', description: 'Can only view tasks, cannot edit' }
];

interface UserInviteProps {
  onInviteSuccess?: (inviteData: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const UserInvite: React.FC<UserInviteProps> = ({
  onInviteSuccess,
  onCancel,
  isModal = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InviteUserForm>({
    resolver: zodResolver(inviteUserSchema),
    mode: 'onBlur',
    defaultValues: {
      role_id: 2 
    }
  });

  const onSubmit = useCallback(async (data: InviteUserForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userManagementService.inviteUser({
        email: data.email,
        role_id: data.role_id
      });

      if (response?.data) {
        const successMessage = `✓ Invitation successfully sent to ${data.email}`;
        setSuccess(successMessage);
        
        if (onInviteSuccess) {
          onInviteSuccess(response.data);
        }
        
        reset();
      } else {
        setError('Error sending invitation. Please try again');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error sending invitation. Please try again';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onInviteSuccess, reset]);

  const containerClass = isModal 
    ? "bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto"
    : "flex items-center justify-center min-h-screen bg-gray-50 px-4";

  const contentClass = isModal 
    ? ""
    : "w-full max-w-md bg-white rounded-2xl shadow-md p-6";

  const Content = () => (
    <div className={contentClass}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Invite User
        </h1>
        <p className="text-gray-600 text-sm">
          Send an invitation to join your workspace
        </p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="flex-1">
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="flex-1">
            <p className="text-red-700 text-sm font-medium">Error sending invitation</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            User email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="user@example.com"
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
            User role
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              {...register('role_id', { valueAsNumber: true })}
              id="role_id"
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          {errors.role_id && (
            <p className="text-red-500 text-xs mt-1">{errors.role_id.message}</p>
          )}
          
          <div className="mt-2 space-y-1">
            {ROLES.map((role) => (
              <div key={role.id} className="text-xs text-gray-500">
                <span className="font-medium">{role.name}:</span> {role.description}
              </div>
            ))}
          </div>
        </div>

        <div className={`flex gap-3 ${isModal ? '' : 'pt-2'}`}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`${onCancel ? 'flex-1' : 'w-full'} py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              'Send invitation'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-xs">
          💡 The user will receive an email with instructions to complete their registration
        </p>
      </div>
    </div>
  );

  return isModal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={containerClass}>
        <Content />
      </div>
    </div>
  ) : (
    <div className={containerClass}>
      <Content />
    </div>
  );
};