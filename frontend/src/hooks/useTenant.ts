import { useAuth } from '../store/auth';
import type { BusinessData } from '../types/api';

export interface UseTenantReturn {
  currentTenant: BusinessData | null;
  businessId: number | null;
  isAuthenticated: boolean;
  hasTenant: boolean;
  tenantName: string | null;
}

export const useTenantInfo = (): UseTenantReturn => {
  const { business, businessId, isAuthenticated } = useAuth();

  return {
    currentTenant: business,
    businessId: businessId(),
    isAuthenticated: isAuthenticated(),
    hasTenant: !!business && !!businessId(),
    tenantName: business?.name || null,
  };
};


export const useTenantHeaders = () => {
  const { businessId } = useAuth();

  return {
    getHeaders: () => {
      const headers: Record<string, string> = {};
      
      const currentBusinessId = businessId();
      if (currentBusinessId) {
        headers['X-Business-Id'] = currentBusinessId.toString();
      }
      
      return headers;
    },
    businessId: businessId(),
  };
};