export interface Task {
  id: number;                   
  title: string;                
  description?: string;        
  status_id: number;           
  created_by: number;          
  created_at: string;          
  updated_at: string;           
  due_date?: string;           
  project_id?: number;
  
  status?: Status;
  creator?: User;
  assignees?: TaskAssignment[];
}

export interface Status {
  id: number;                   
  name: string;                
  order: number;                
}

export interface TaskHistory {
  id: number;                  
  task_id: number;             
  user_id: number;              
  field_changed: string;       
  old_value?: string;           
  new_value?: string;          
  changed_at: string;           
}

export interface TaskAssignment {
  task_id: number;              
  user_id: number;               
  assigned_at: string;         
}

export interface Role {
  id: number;                   
  name: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status_id: number;
  created_by: number;
  due_date?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status_id?: number;
  due_date?: string;
}

export interface TaskWithRelations extends Task {
  status: Status;
  creator: User;
  assignees: (TaskAssignment & { user: User })[];
}

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}