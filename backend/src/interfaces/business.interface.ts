export interface IBusiness {
  id: number;
  name: string;
  email?: string;
  owner_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateBusiness {
  name: string;
  email?: string;
}

export interface IUpdateBusiness {
  name?: string;
  email?: string;
  owner_id?: number;
}