export interface IProject {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProject {
  business_id: number;
  name: string;
  description?: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface IUpdateProject {
  name?: string;
  description?: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface IProjectQueryParams {
  status?: string;
  limit?: number;
  offset?: number;
}
