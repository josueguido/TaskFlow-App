export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'member' | 'viewer';
  businessId?: string; 
}

export interface Business {
  id: string;
  name: string;
  slug?: string;
  domain?: string;
  settings?: Record<string, any>;
}

export interface UserWithBusiness extends User {
  business?: Business;
}