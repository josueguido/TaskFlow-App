export interface ITask {
  title: string;
  description?: string;
  status_id: number;
  project_id?: number;
  due_date?: Date;
  business_id?: number;
  created_at: Date;
}

export interface ICreateTaskInput {
  title: string;
  description?: string;
  status_id: number;
  project_id?: number;
  due_date?: Date;
  business_id?: number;
  created_at: Date;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
  status_id?: number;
  due_date?: Date;
}

export interface ICalendarEvent {
  id: number;
  title: string;
  description?: string;
  due_date: Date;
  project_id: number;
  status_name: string;
  project_name: string;
  assigned_users: string[];
  assigned_user_ids: number[];
  created_at: Date;
  updated_at: Date;
}
