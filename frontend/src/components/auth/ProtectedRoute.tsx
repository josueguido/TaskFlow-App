import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number | number[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login',
}) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const userRole = useAuth((state) => state.userRole());
  const rehydrated = useAuth((state) => state.rehydrated);

  // Wait for auth state to hydrate
  if (!rehydrated) {
    return <div className="text-white">Loading...</div>;
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (userRole && !requiredRoles.includes(userRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page</p>
            <a
              href="/app"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
