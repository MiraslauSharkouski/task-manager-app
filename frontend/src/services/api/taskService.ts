import api from './api';
import { Task, TaskFormData, TaskApiResponse, TaskFilters } from '../../types/tasks';

export const taskService = {
  getAll: async (page: number = 1, filters: TaskFilters = {}): Promise<TaskApiResponse> => {
    try {
      const params: any = { page, ...filters };
      const response = await api.get<TaskApiResponse>('/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Task> => {
    try {
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get task error:', error);
      throw error;
    }
  },

  create: async (taskData: TaskFormData): Promise<Task> => {
    try {
      const response = await api.post<{ data: Task }>('/tasks', taskData);
      return response.data.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  update: async (id: number, taskData: TaskFormData): Promise<Task> => {
    try {
      const response = await api.put<{ data: Task }>(`/tasks/${id}`, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
};
