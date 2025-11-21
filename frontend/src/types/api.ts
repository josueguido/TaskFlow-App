export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSignupRequest {
  invite_token: string;
  name: string;
  password: string;
}

export interface BusinessSignupRequest {
  name: string;
  admin_name: string;
  admin_email: string;
  password: string;
}

export interface UserInviteRequest {
  email: string;
  role_id?: number;
}

// Auth Response Types
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserData;
}

export interface UserSignupResponse {
  message: string;
  user: UserData;
}

export interface BusinessSignupResponse {
  message: string;
  business: BusinessData;
  admin: UserData;
}

export interface UserInviteResponse {
  message: string;
  invite_token: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role_id: number;
  business_id?: string;
  created_at: string;
}

export interface BusinessData {
  id: string;
  name: string;
  admin_id?: string;
  created_at?: string;
}
