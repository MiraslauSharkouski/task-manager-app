import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/api/taskService';
import { Task, TaskFilters, TaskFormData } from '../../types/tasks';

// Ключи для кэширования запросов
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: TaskFilters) => [...TASK_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...TASK_QUERY_KEYS.details(), id] as const,
};

// Хук для получения списка задач
export const useTasksQuery = (page: number = 1, filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list({ ...filters, page }),
    queryFn: () => taskService.getAll(page, filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

// Хук для получения одной задачи
export const useTaskQuery = (id: number) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(id),
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

// Хук для создания задачи
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: TaskFormData) => taskService.create(taskData),
    onSuccess: () => {
      // Инвалидируем кэш для списка задач
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// Хук для обновления задачи
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, taskData }: { id: number; taskData: TaskFormData }) => 
      taskService.update(id, taskData),
    onSuccess: (updatedTask) => {
      // Обновляем конкретную задачу в кэше
      queryClient.setQueryData(
        TASK_QUERY_KEYS.detail(updatedTask.id),
        updatedTask
      );
      // Инвалидируем кэш для списка задач
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// Хук для удаления задачи
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: (_, deletedTaskId) => {
      // Удаляем задачу из кэша
      queryClient.removeQueries({ queryKey: TASK_QUERY_KEYS.detail(deletedTaskId) });
      // Инвалидируем кэш для списка задач
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};
