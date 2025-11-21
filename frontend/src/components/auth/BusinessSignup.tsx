import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { businessAuthService } from '../../services/authService';
import { Building2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Schema de validación
const businessSignupSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del negocio debe tener al menos 2 caracteres')
    .max(100, 'El nombre del negocio no puede exceder 100 caracteres'),
  admin_name: z
    .string()
    .min(2, 'El nombre del administrador debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  admin_email: z
    .string()
    .email('Formato de email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/,
      'La contraseña debe incluir mayúscula, minúscula, número y caracter especial'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type BusinessSignupForm = z.infer<typeof businessSignupSchema>;

export const BusinessSignup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BusinessSignupForm>({
    resolver: zodResolver(businessSignupSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: BusinessSignupForm) => {
    try {
      setLoading(true);
      setError(null);

      // Llamar al servicio de registro de negocio
      const response = await businessAuthService.signupBusiness({
        name: data.name,
        admin_name: data.admin_name,
        admin_email: data.admin_email,
        password: data.password
      });

      if (response.data) {
        // Redirigir al login con mensaje de éxito
        navigate('/login', {
          state: {
            message: 'Negocio creado exitosamente. Por favor inicia sesión.',
            email: data.admin_email
          }
        });
      } else {
        setError('Error al crear el negocio');
      }
    } catch (err: any) {
      console.error('Error en registro de negocio:', err);
      setError(err.message || 'Error inesperado al crear el negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crea tu negocio
          </h1>
          <p className="text-gray-600 text-sm">
            Registra tu empresa y comienza a gestionar tareas
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del negocio
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('name')}
                id="name"
                type="text"
                placeholder="Mi Empresa S.A."
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Admin Name */}
          <div>
            <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del administrador
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('admin_name')}
                id="admin_name"
                type="text"
                placeholder="Juan Pérez"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.admin_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.admin_name && (
              <p className="text-red-500 text-xs mt-1">{errors.admin_name.message}</p>
            )}
          </div>

          {/* Admin Email */}
          <div>
            <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email del administrador
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('admin_email')}
                id="admin_email"
                type="email"
                placeholder="juan@miempresa.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.admin_email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.admin_email && (
              <p className="text-red-500 text-xs mt-1">{errors.admin_email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="********"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando negocio...
              </>
            ) : (
              'Crear negocio'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};