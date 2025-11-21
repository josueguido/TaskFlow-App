export interface IProjectUser {
  id?: number;
  project_id: number;
  user_id: number;
  role: 'admin' | 'member';
  created_at?: Date;
  updated_at?: Date;
}

export interface IProjectUserWithUser extends IProjectUser {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface IProjectWithUsers {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  users?: IProjectUserWithUser[];
  created_at: Date;
  updated_at: Date;
}
