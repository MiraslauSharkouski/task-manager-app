import { useState, useCallback } from 'react';
import { useTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from './useTaskQueries';
import { TaskFilters, TaskFormData } from '../../types/tasks';

export const useTasks = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({});
  
  // Используем React Query для получения задач
  const { 
    data: tasksData, 
    isLoading, 
    isError, 
    error 
  } = useTasksQuery(page, filters);
  
  // Мутации для CRUD операций
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const fetchTasks = useCallback((newPage: number = 1) => {
    setPage(newPage);
  }, []);

  const setTaskFilters = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
    setPage(1); // Сбрасываем на первую страницу при изменении фильтров
  }, []);

  const createTask = async (taskData: TaskFormData) => {
    return createTaskMutation.mutateAsync(taskData);
  };

  const updateTask = async (id: number, taskData: TaskFormData) => {
    return updateTaskMutation.mutateAsync({ id, taskData });
  };

  const deleteTask = async (id: number) => {
    return deleteTaskMutation.mutateAsync(id);
  };

  return {
    tasks: tasksData?.data || [],
    pagination: tasksData?.meta || null,
    loading: isLoading,
    error: isError ? (error as Error)?.message || 'Failed to load tasks' : null,
    filters,
    page,
    fetchTasks,
    setTaskFilters,
    createTask,
    updateTask,
    deleteTask,
    // Состояния мутаций
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
    createError: createTaskMutation.isError ? (createTaskMutation.error as Error)?.message : null,
    updateError: updateTaskMutation.isError ? (updateTaskMutation.error as Error)?.message : null,
    deleteError: deleteTaskMutation.isError ? (deleteTaskMutation.error as Error)?.message : null,
  };
};
