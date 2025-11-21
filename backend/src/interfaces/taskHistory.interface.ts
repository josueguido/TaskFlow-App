export interface ITaskHistory {
  id: number;
  taskId: number;
  user_id: number;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: Date;
}

export interface ICreateTaskHistory {
  task_id: number;
  user_id: number;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
}
