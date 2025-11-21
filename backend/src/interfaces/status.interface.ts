export interface IStatus {
  id: number;
  name: string;
  order: number;
  business_id: number;
}

export interface ICreateStatus {
  name: string;
  order: number;
  business_id: number;
}

export interface IUpdateStatus {
  name?: string;
  order?: number;
}
