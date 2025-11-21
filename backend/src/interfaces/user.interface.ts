export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role_id: number | null;
  business_id: number | null;
  status: 'pending' | 'active' | 'inactive';
  invite_token?: string | null;
  invited_at?: Date | null;
  activated_at?: Date | null;
  created_at: string;
  updated_at: string;
}

export interface ICreateUserInvite {
  email: string;
  business_id: number;
  role_id?: number;
}

export interface ICompleteUserSignup {
  invite_token: string;
  name: string;
  password: string;
}
