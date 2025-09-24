import api from './api';
import { Task, TaskFormData } from '../../types/tasks';

export const taskService = {
  getAll: async (page = 1, filters = {}) => {
    const params = { page, ...filters };
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (taskData: TaskFormData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  },

  update: async (id: number, taskData: TaskFormData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  delete: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },
};
