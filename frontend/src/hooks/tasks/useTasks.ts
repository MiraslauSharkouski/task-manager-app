import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../../services/api/taskService';
import { Task, TaskFormData, TaskFilters, TaskApiResponse } from '../../types/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TaskApiResponse['meta'] | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchTasks = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.getAll(page, filters);
      setTasks(response.data);
      setPagination(response.meta);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (taskData: TaskFormData): Promise<Task> => {
    setLoading(true);
    setError(null);
    
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: TaskFormData): Promise<Task> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.update(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setTaskFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setTaskFilters,
  };
};
