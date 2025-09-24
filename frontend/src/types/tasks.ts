import { User } from './auth';

export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  user: User;
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

export interface TaskResponse {
  data: Task[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
