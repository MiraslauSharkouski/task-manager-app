import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useTasks } from '../../../hooks/tasks/useTasks';
import TaskListPage from '../../../pages/tasks/TaskListPage';

// Mock services
jest.mock('../../../services/api/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('../../../services/api/taskService', () => ({
  taskService: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('State Management Integration', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
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
    localStorage.clear();
  });

  describe('Auth State Integration', () => {
    it('should maintain authentication state across component renders', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };
      
      const mockResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        user: mockUser,
      };

      const { authService } = require('../../../services/api/authService');
      authService.login.mockResolvedValue(mockResponse);

      // Create test component to check auth state
      const TestComponent: React.FC = () => {
        const { state, login } = useAuth();
        
        return (
          <div>
            <div data-testid="auth-state">
              Authenticated: {state.isAuthenticated.toString()}
            </div>
            <div data-testid="user-name">
              User: {state.user?.name || 'None'}
            </div>
            <button 
              onClick={() => login({ email: 'test@example.com', password: 'password123' })}
              data-testid="login-button"
            >
              Login
            </button>
          </div>
        );
      };

      const { getByTestId } = render(<TestComponent />, { wrapper });

      // Initially not authenticated
      expect(getByTestId('auth-state')).toHaveTextContent('Authenticated: false');
      expect(getByTestId('user-name')).toHaveTextContent('User: None');

      // Click login button
      fireEvent.click(getByTestId('login-button'));

      // Wait for state update
      await waitFor(() => {
        expect(getByTestId('auth-state')).toHaveTextContent('Authenticated: true');
        expect(getByTestId('user-name')).toHaveTextContent('User: Test User');
      });

      // Check that token is stored
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should handle logout and clear state properly', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };
      
      const mockLoginResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        user: mockUser,
      };

      const { authService } = require('../../../services/api/authService');
      authService.login.mockResolvedValueOnce(mockLoginResponse);
      authService.logout.mockResolvedValueOnce({});

      // Create test component with login and logout
      const TestAuthComponent: React.FC = () => {
        const { state, login, logout } = useAuth();
        
        return (
          <div>
            <div data-testid="auth-state">
              Authenticated: {state.isAuthenticated.toString()}
            </div>
            <div data-testid="user-name">
              User: {state.user?.name || 'None'}
            </div>
            {!state.isAuthenticated ? (
              <button 
                onClick={() => login({ email: 'test@example.com', password: 'password123' })}
                data-testid="login-button"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={() => logout()}
                data-testid="logout-button"
              >
                Logout
              </button>
            )}
          </div>
        );
      };

      const { getByTestId } = render(<TestAuthComponent />, { wrapper });

      // Login first
      fireEvent.click(getByTestId('login-button'));
      
      await waitFor(() => {
        expect(getByTestId('auth-state')).toHaveTextContent('Authenticated: true');
      });

      // Then logout
      fireEvent.click(getByTestId('logout-button'));
      
      await waitFor(() => {
        expect(getByTestId('auth-state')).toHaveTextContent('Authenticated: false');
        expect(getByTestId('user-name')).toHaveTextContent('User: None');
      });

      // Check that token is cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Task State Integration', () => {
    it('should manage task state with React Query caching', async () => {
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
        {
          id: 2,
          user_id: 1,
          title: 'Test Task 2',
          description: 'Test description 2',
          status: 'in_progress',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
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
          total: 2,
          from: 1,
          to: 2,
        },
        links: {
          first: 'http://localhost/api/tasks?page=1',
          last: 'http://localhost/api/tasks?page=1',
          prev: null,
          next: null,
        },
      };

      const { taskService } = require('../../../services/api/taskService');
      taskService.getAll.mockResolvedValue(mockResponse);

      // Create test component to check task state
      const TestTaskComponent: React.FC = () => {
        const { tasks, loading, error, fetchTasks } = useTasks();
        
        return (
          <div>
            <button 
              onClick={() => fetchTasks(1)}
              data-testid="fetch-tasks"
            >
              Fetch Tasks
            </button>
            {loading && <div data-testid="loading">Loading...</div>}
            {error && <div data-testid="error">Error: {error}</div>}
            <div data-testid="task-count">
              Tasks: {tasks.length}
            </div>
            {tasks.map(task => (
              <div key={task.id} data-testid={`task-${task.id}`}>
                {task.title}
              </div>
            ))}
          </div>
        );
      };

      const { getByTestId } = render(<TestTaskComponent />, { wrapper });

      // Initially no tasks
      expect(getByTestId('task-count')).toHaveTextContent('Tasks: 0');

      // Fetch tasks
      fireEvent.click(getByTestId('fetch-tasks'));

      // Wait for tasks to load
      await waitFor(() => {
        expect(getByTestId('task-count')).toHaveTextContent('Tasks: 2');
        expect(getByTestId('task-1')).toHaveTextContent('Test Task 1');
        expect(getByTestId('task-2')).toHaveTextContent('Test Task 2');
      });

      // Check that tasks are cached
      expect(taskService.getAll).toHaveBeenCalledTimes(1);

      // Fetch again - should use cache
      fireEvent.click(getByTestId('fetch-tasks'));
      
      // Wait for cache to be used (no additional API calls)
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(taskService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle task mutations with proper cache invalidation', async () => {
      const mockTask = {
        id: 1,
        user_id: 1,
        title: 'Original Task',
        description: 'Original description',
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

      const updatedMockTask = {
        ...mockTask,
        title: 'Updated Task',
        status: 'in_progress',
        updated_at: '2023-01-02T00:00:00Z',
      };

      const { taskService } = require('../../../services/api/taskService');
      taskService.update.mockResolvedValue(updatedMockTask);

      // Create test component to check task mutations
      const TestMutationComponent: React.FC = () => {
        const { tasks, updateTask } = useTasks();
        
        return (
          <div>
            <button 
              onClick={() => updateTask(1, { 
                title: 'Updated Task', 
                description: 'Original description',
                status: 'in_progress' 
              })}
              data-testid="update-task"
            >
              Update Task
            </button>
            <div data-testid="task-title">
              {tasks.length > 0 ? tasks[0].title : 'No tasks'}
            </div>
            <div data-testid="task-status">
              {tasks.length > 0 ? tasks[0].status : 'No tasks'}
            </div>
          </div>
        );
      };

      const { getByTestId } = render(<TestMutationComponent />, { wrapper });

      // Simulate having a task in state
      queryClient.setQueryData(['tasks', 'list', {}], {
        data: [mockTask],
        meta: { current_page: 1, last_page: 1, total: 1 },
        links: {},
      });

      // Force re-render to pick up cached data
      const { getByTestId: getByTestId2 } = render(<TestMutationComponent />, { wrapper });

      // Check initial state
      expect(getByTestId2('task-title')).toHaveTextContent('Original Task');
      expect(getByTestId2('task-status')).toHaveTextContent('pending');

      // Update task
      fireEvent.click(getByTestId2('update-task'));

      // Wait for update to complete
      await waitFor(() => {
        expect(getByTestId2('task-title')).toHaveTextContent('Updated Task');
        expect(getByTestId2('task-status')).toHaveTextContent('in_progress');
      });

      // Check that update was called
      expect(taskService.update).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        description: 'Original description',
        status: 'in_progress',
      });
    });
  });

  describe('Full Application State Integration', () => {
    it('should integrate auth and task states properly in full application flow', async () => {
      // Mock auth service
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };
      
      const mockAuthResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        user: mockUser,
      };

      const { authService } = require('../../../services/api/authService');
      authService.login.mockResolvedValue(mockAuthResponse);

      // Mock task service
      const mockTasks = [
        {
          id: 1,
          user_id: 1,
          title: 'User Task',
          description: 'Task belonging to user',
          status: 'pending',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          user: mockUser,
        },
      ];

      const mockTaskResponse = {
        data: mockTasks,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 1,
          from: 1,
          to: 1,
        },
        links: {
          first: 'http://localhost/api/tasks?page=1',
          last: 'http://localhost/api/tasks?page=1',
          prev: null,
          next: null,
        },
      };

      const { taskService } = require('../../../services/api/taskService');
      taskService.getAll.mockResolvedValue(mockTaskResponse);

      // Render full task list page
      const { getByText, getByPlaceholderText } = render(<TaskListPage />, { wrapper });

      // Check that we can interact with the full application state
      await waitFor(() => {
        expect(getByText('Tasks')).toBeInTheDocument();
      });

      // Since we're not authenticated, we should be redirected or show auth state
      // This test demonstrates the integration between auth and task states
    });
  });
});
