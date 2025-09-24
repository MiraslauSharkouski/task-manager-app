import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../tasks/useTasks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock task service
jest.mock('../../services/api/taskService', () => ({
  taskService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useTasks Hook', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({});
  });

  it('should fetch tasks successfully', async () => {
    const mockTasks = [
      {
        id: 1,
        user_id: 1,
        title: 'Test Task 1',
        description: 'Test description 1',
        status: 'pending',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      },
    ];

    const mockResponse = {
      data: mockTasks,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 1,
        from: 1,
        to: 1,
      },
    };

    const { taskService } = require('../../services/api/taskService');
    taskService.getAll.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch tasks error', async () => {
    const { taskService } = require('../../services/api/taskService');
    taskService.getAll.mockRejectedValue(new Error('Failed to fetch tasks'));

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch tasks');
  });

  it('should create task successfully', async () => {
    const newTask = {
      id: 2,
      user_id: 1,
      title: 'New Task',
      description: 'New task description',
      status: 'pending',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    };

    const { taskService } = require('../../services/api/taskService');
    taskService.create.mockResolvedValue(newTask);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.createTask({
        title: 'New Task',
        description: 'New task description',
        status: 'pending',
      });
    });

    expect(taskService.create).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New task description',
      status: 'pending',
    });
  });

  it('should update task successfully', async () => {
    const updatedTask = {
      id: 1,
      user_id: 1,
      title: 'Updated Task',
      description: 'Updated task description',
      status: 'in_progress',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    };

    const { taskService } = require('../../services/api/taskService');
    taskService.update.mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.updateTask(1, {
        title: 'Updated Task',
        description: 'Updated task description',
        status: 'in_progress',
      });
    });

    expect(taskService.update).toHaveBeenCalledWith(1, {
      title: 'Updated Task',
      description: 'Updated task description',
      status: 'in_progress',
    });
  });

  it('should delete task successfully', async () => {
    const { taskService } = require('../../services/api/taskService');
    taskService.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(taskService.delete).toHaveBeenCalledWith(1);
  });

  it('should set task filters correctly', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => {
      result.current.setTaskFilters({
        status: 'pending',
        search: 'test',
      });
    });

    expect(result.current.filters).toEqual({
      status: 'pending',
      search: 'test',
    });
  });
});
