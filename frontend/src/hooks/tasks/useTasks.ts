import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../../types/tasks';
import api from '../../services/api';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters?.status) params.status = filters.status;
        if (filters?.search) params.search = filters.search;

        const response = await api.get('/tasks', { params });
        setTasks(response.data.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters]);

  const createTask = async (taskData: any) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, response.data.data]);
      return response.data.data;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: number, taskData: any) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      setTasks(prev => prev.map(task => task.id === id ? response.data.data : task));
      return response.data.data;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
};
