export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}

export interface TaskPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface TaskApiResponse {
  data: Task[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: TaskPagination;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: TaskPagination | null;
  filters: TaskFilters;
}
