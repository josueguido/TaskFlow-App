import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../store/auth';
import type { BusinessData } from '../types/api';

interface TenantContextType {
  currentTenant: BusinessData | null;
  isLoading: boolean;
  switchTenant: (tenantId: number) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { business, businessId, token } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<BusinessData | null>(business);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTenant(business);
  }, [business]);

  const refreshTenant = async () => {
    const currentBusinessId = businessId();
    if (!currentBusinessId || !token) return;
    
    setIsLoading(true);
    try {
      // TODO: Implementar llamada al API para obtener información del tenant
      // const response = await api.get(`/api/businesses/${currentBusinessId}`);
      // const tenantData = response.data;
      // setBusiness(tenantData);
      // setCurrentTenant(tenantData);
    } catch (error) {
      console.error('Error refreshing tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // TODO: Implementar cambio de tenant
      // const response = await api.post(`/api/auth/switch-tenant`, { tenantId });
      // const { business } = response.data;
      // setBusiness(business);
      // setCurrentTenant(business);
    } catch (error) {
      console.error('Error switching tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: TenantContextType = {
    currentTenant,
    isLoading,
    switchTenant,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};