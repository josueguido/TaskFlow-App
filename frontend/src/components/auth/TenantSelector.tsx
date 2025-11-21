import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { getMyBusinesses, switchBusiness } from '@/api/businesses';
import type { BusinessData } from '../../types/api';

export const TenantSelector: React.FC = () => {
  const [tenants, setTenants] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setBusiness = useAuth((state) => state.setBusiness);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTenants();
  }, []);

  const fetchUserTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const businesses = await getMyBusinesses();
      setTenants(businesses);
    } catch (err: any) {
      setError(err.message || 'Error loading workspaces');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectTenant = async (tenant: BusinessData) => {
    try {
      setLoading(true);
      const businessData = await switchBusiness(Number(tenant.id));
      setBusiness(businessData);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Error selecting workspace');
      console.error('Error selecting tenant:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando workspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserTenants}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selecciona tu workspace
          </h1>
          <p className="text-gray-600">
            Elige el workspace con el que quieres trabajar
          </p>
        </div>

        <div className="space-y-3">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => selectTenant(tenant)}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                  <span className="text-blue-600 font-semibold text-sm">
                    {tenant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                  <p className="text-sm text-gray-500">ID: {tenant.id}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900">
            ¿No encuentras tu workspace? Contacta a tu administrador
          </button>
        </div>
      </div>
    </div>
  );
};