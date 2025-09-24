import { taskService } from '../../../services/api/taskService';
import { authService } from '../../../services/api/authService';
import { TaskFormData, TaskFilters } from '../../../types/tasks';
import { LoginCredentials, RegisterData } from '../../../types/auth';

// Mock axios
jest.mock('axios');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('AuthService Integration', () => {
    it('should handle user registration successfully', async () => {
      const mockUserData: RegisterData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      };

      const mockResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockResponse }),
      });

      const response = await authService.register(mockUserData);

      expect(response).toEqual(mockResponse);
      expect(mockAxios.create().post).toHaveBeenCalledWith('/register', mockUserData);
    });

    it('should handle user login successfully', async () => {
      const mockCredentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockResponse }),
      });

      const response = await authService.login(mockCredentials);

      expect(response).toEqual(mockResponse);
      expect(mockAxios.create().post).toHaveBeenCalledWith('/login', mockCredentials);
    });

    it('should handle user logout successfully', async () => {
      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({}),
      });

      await authService.logout();

      expect(mockAxios.create().post).toHaveBeenCalledWith('/logout');
    });

    it('should handle get current user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockUser }),
      });

      const response = await authService.getCurrentUser();

      expect(response).toEqual(mockUser);
      expect(mockAxios.create().get).toHaveBeenCalledWith('/user');
    });

    it('should handle API errors gracefully', async () => {
      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: 'Invalid credentials',
            },
          },
        }),
      });

      await expect(
        authService.login({
          email: 'invalid@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('TaskService Integration', () => {
    it('should handle get all tasks successfully', async () => {
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
        links: {
          first: 'http://localhost/api/tasks?page=1',
          last: 'http://localhost/api/tasks?page=1',
          prev: null,
          next: null,
        },
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 1,
          from: 1,
          to: 1,
        },
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockResponse }),
      });

      const response = await taskService.getAll(1, {});

      expect(response).toEqual(mockResponse);
      expect(mockAxios.create().get).toHaveBeenCalledWith('/tasks', { params: { page: 1 } });
    });

    it('should handle get task by id successfully', async () => {
      const mockTask = {
        id: 1,
        user_id: 1,
        title: 'Test Task',
        description: 'Test description',
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
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: mockTask } }),
      });

      const response = await taskService.getById(1);

      expect(response).toEqual(mockTask);
      expect(mockAxios.create().get).toHaveBeenCalledWith('/tasks/1');
    });

    it('should handle create task successfully', async () => {
      const mockTaskData: TaskFormData = {
        title: 'New Task',
        description: 'New task description',
        status: 'pending',
      };

      const mockCreatedTask = {
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

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: { data: mockCreatedTask } }),
      });

      const response = await taskService.create(mockTaskData);

      expect(response).toEqual(mockCreatedTask);
      expect(mockAxios.create().post).toHaveBeenCalledWith('/tasks', mockTaskData);
    });

    it('should handle update task successfully', async () => {
      const mockTaskData: TaskFormData = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in_progress',
      };

      const mockUpdatedTask = {
        id: 1,
        user_id: 1,
        title: 'Updated Task',
        description: 'Updated description',
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

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        put: jest.fn().mockResolvedValue({ data: { data: mockUpdatedTask } }),
      });

      const response = await taskService.update(1, mockTaskData);

      expect(response).toEqual(mockUpdatedTask);
      expect(mockAxios.create().put).toHaveBeenCalledWith('/tasks/1', mockTaskData);
    });

    it('should handle delete task successfully', async () => {
      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        delete: jest.fn().mockResolvedValue({}),
      });

      await taskService.delete(1);

      expect(mockAxios.create().delete).toHaveBeenCalledWith('/tasks/1');
    });

    it('should handle filtered task requests', async () => {
      const mockFilters: TaskFilters = {
        status: 'pending',
        search: 'test',
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [], meta: {}, links: {} } }),
      });

      await taskService.getAll(1, mockFilters);

      expect(mockAxios.create().get).toHaveBeenCalledWith('/tasks', { 
        params: { page: 1, status: 'pending', search: 'test' } 
      });
    });
  });
});
