export interface IAssignment {
  task_id: number;
  user_id: number;
  assigned_at: Date;
  user_name?: string;
  user_email?: string;
  task_title?: string;
  task_description?: string;
}
export interface ICreateAssignment {
  task_id: number;
  user_id: number;
}

export interface IUpdateAssignment {
  assigned_at?: Date;
}
