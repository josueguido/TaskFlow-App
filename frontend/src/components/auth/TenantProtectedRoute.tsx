import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTenantInfo } from '../../hooks/useTenant';

interface TenantProtectedRouteProps {
  children: React.ReactNode;
  requireTenant?: boolean;
}

export const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({ 
  children, 
  requireTenant = true 
}) => {
  const { isAuthenticated, hasTenant } = useTenantInfo();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireTenant && !hasTenant) {
    return <Navigate to="/select-tenant" replace />;
  }

  return <>{children}</>;
};

export const TenantLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando workspace...</p>
      </div>
    </div>
  );
};