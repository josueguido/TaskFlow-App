import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userManagementService } from '../../services/authService';
import { UserPlus, Mail, Users } from 'lucide-react';

// Schema de validación
const inviteUserSchema = z.object({
  email: z
    .string()
    .email('Formato de email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  role_id: z
    .number()
    .min(1, 'Debe seleccionar un rol')
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;

// Tipos de roles disponibles
const ROLES = [
  { id: 1, name: 'Administrador', description: 'Acceso completo al sistema' },
  { id: 2, name: 'Empleado', description: 'Acceso a tareas y proyectos asignados' },
  { id: 3, name: 'Visualizador', description: 'Solo puede ver tareas, sin editar' }
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
      role_id: 2 // Empleado por defecto
    }
  });

  const onSubmit = async (data: InviteUserForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userManagementService.inviteUser({
        email: data.email,
        role_id: data.role_id
      });

      if (response.data) {
        const successMessage = `Invitación enviada a ${data.email}`;
        setSuccess(successMessage);
        
        if (onInviteSuccess) {
          onInviteSuccess(response.data);
        }
        
        // Limpiar formulario después de éxito
        reset();
      } else {
        setError('Error al enviar la invitación');
      }
    } catch (err: any) {
      console.error('Error inviting user:', err);
      setError(err.message || 'Error al enviar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const containerClass = isModal 
    ? "bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto"
    : "flex items-center justify-center min-h-screen bg-gray-50 px-4";

  const contentClass = isModal 
    ? ""
    : "w-full max-w-md bg-white rounded-2xl shadow-md p-6";

  const Content = () => (
    <div className={contentClass}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Invitar Usuario
        </h1>
        <p className="text-gray-600 text-sm">
          Envía una invitación para unirse a tu workspace
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email del usuario
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
            Rol del usuario
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
          
          {/* Role descriptions */}
          <div className="mt-2 space-y-1">
            {ROLES.map((role) => (
              <div key={role.id} className="text-xs text-gray-500">
                <span className="font-medium">{role.name}:</span> {role.description}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 ${isModal ? '' : 'pt-2'}`}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
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
                Enviando...
              </>
            ) : (
              'Enviar invitación'
            )}
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-xs">
          💡 El usuario recibirá un email con instrucciones para completar su registro
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