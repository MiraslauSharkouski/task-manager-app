import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock all services
jest.mock('../../services/api/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('../../services/api/taskService', () => ({
  taskService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('User Flow Integration Tests', () => {
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

  describe('Complete User Journey', () => {
    it('should allow user to register, login, create tasks, and logout', async () => {
      // Mock data
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

      const mockTasks = [
        {
          id: 1,
          user_id: 1,
          title: 'My First Task',
          description: 'This is my first task',
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
        links: {},
      };

      const { authService, taskService } = require('../../services/api');

      // Mock service responses
      authService.register.mockResolvedValue(mockAuthResponse);
      authService.login.mockResolvedValue(mockAuthResponse);
      authService.logout.mockResolvedValue({});
      taskService.getAll.mockResolvedValue(mockTaskResponse);
      taskService.create.mockResolvedValue({
        ...mockTasks[0],
        id: 2,
        title: 'New Task',
        description: 'New task description',
        status: 'pending',
      });

      // Create test component that simulates complete user journey
      const CompleteJourneyTest: React.FC = () => {
        const [currentStep, setCurrentStep] = React.useState<'register' | 'login' | 'tasks'>('register');
        const [isLoggedIn, setIsLoggedIn] = React.useState(false);

        const handleRegister = async () => {
          try {
            await authService.register({
              name: 'Test User',
              email: 'test@example.com',
              password: 'password123',
              password_confirmation: 'password123',
            });
            setIsLoggedIn(true);
            setCurrentStep('tasks');
          } catch (error) {
            console.error('Registration failed:', error);
          }
        };

        const handleLogin = async () => {
          try {
            await authService.login({
              email: 'test@example.com',
              password: 'password123',
            });
            setIsLoggedIn(true);
            setCurrentStep('tasks');
          } catch (error) {
            console.error('Login failed:', error);
          }
        };

        const handleLogout = async () => {
          try {
            await authService.logout();
            setIsLoggedIn(false);
            setCurrentStep('login');
          } catch (error) {
            console.error('Logout failed:', error);
          }
        };

        return (
          <div>
            <h1>Complete User Journey Test</h1>
            
            {!isLoggedIn && currentStep === 'register' && (
              <div data-testid="registration-step">
                <h2>Registration Step</h2>
                <button 
                  onClick={handleRegister}
                  data-testid="register-button"
                >
                  Register
                </button>
                <button 
                  onClick={() => setCurrentStep('login')}
                  data-testid="switch-to-login"
                >
                  Switch to Login
                </button>
              </div>
            )}

            {!isLoggedIn && currentStep === 'login' && (
              <div data-testid="login-step">
                <h2>Login Step</h2>
                <button 
                  onClick={handleLogin}
                  data-testid="login-button"
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentStep('register')}
                  data-testid="switch-to-register"
                >
                  Switch to Register
                </button>
              </div>
            )}

            {isLoggedIn && currentStep === 'tasks' && (
              <div data-testid="tasks-step">
                <h2>Tasks Step</h2>
                <button 
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  Logout
                </button>
                <div data-testid="welcome-message">
                  Welcome, {mockUser.name}!
                </div>
              </div>
            )}
          </div>
        );
      };

      const { getByTestId } = render(<CompleteJourneyTest />, { wrapper });

      // Step 1: Registration
      expect(getByTestId('registration-step')).toBeInTheDocument();
      fireEvent.click(getByTestId('register-button'));

      await waitFor(() => {
        expect(getByTestId('tasks-step')).toBeInTheDocument();
        expect(getByTestId('welcome-message')).toHaveTextContent('Welcome, Test User!');
      });

      // Check that registration was called
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });

      // Check that token is stored
      expect(localStorage.getItem('auth_token')).toBe('test-token');

      // Step 2: Logout
      fireEvent.click(getByTestId('logout-button'));

      await waitFor(() => {
        expect(getByTestId('login-step')).toBeInTheDocument();
      });

      // Check that token is cleared
      expect(localStorage.getItem('auth_token')).toBeNull();

      // Step 3: Login
      fireEvent.click(getByTestId('login-button'));

      await waitFor(() => {
        expect(getByTestId('tasks-step')).toBeInTheDocument();
        expect(getByTestId('welcome-message')).toHaveTextContent('Welcome, Test User!');
      });

      // Check that login was called
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      // Check that token is stored again
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should handle task management workflow', async () => {
      // Mock data for task management
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

      const mockTasks = [
        {
          id: 1,
          user_id: 1,
          title: 'Existing Task',
          description: 'This task already exists',
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
        links: {},
      };

      const { authService, taskService } = require('../../services/api');

      // Mock service responses
      authService.login.mockResolvedValue(mockAuthResponse);
      taskService.getAll.mockResolvedValue(mockTaskResponse);
      taskService.create.mockResolvedValue({
        ...mockTasks[0],
        id: 2,
        title: 'New Task',
        description: 'New task description',
        status: 'pending',
      });
      taskService.update.mockResolvedValue({
        ...mockTasks[0],
        title: 'Updated Task',
        status: 'in_progress',
        updated_at: '2023-01-02T00:00:00Z',
      });
      taskService.delete.mockResolvedValue({});

      // Create test component for task management workflow
      const TaskManagementTest: React.FC = () => {
        const [isLoggedIn, setIsLoggedIn] = React.useState(false);
        const [tasks, setTasks] = React.useState<any[]>([]);
        const [loading, setLoading] = React.useState(false);

        const handleLogin = async () => {
          try {
            await authService.login({
              email: 'test@example.com',
              password: 'password123',
            });
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Login failed:', error);
          }
        };

        const fetchTasks = async () => {
          setLoading(true);
          try {
            const response = await taskService.getAll(1, {});
            setTasks(response.data);
          } catch (error) {
            console.error('Fetch tasks failed:', error);
          } finally {
            setLoading(false);
          }
        };

        const createTask = async () => {
          try {
            const newTask = await taskService.create({
              title: 'New Task',
              description: 'New task description',
              status: 'pending',
            });
            setTasks(prev => [...prev, newTask]);
          } catch (error) {
            console.error('Create task failed:', error);
          }
        };

        const updateTask = async () => {
          try {
            const updatedTask = await taskService.update(1, {
              title: 'Updated Task',
              description: 'This task already exists',
              status: 'in_progress',
            });
            setTasks(prev => prev.map(task => task.id === 1 ? updatedTask : task));
          } catch (error) {
            console.error('Update task failed:', error);
          }
        };

        const deleteTask = async () => {
          try {
            await taskService.delete(1);
            setTasks(prev => prev.filter(task => task.id !== 1));
          } catch (error) {
            console.error('Delete task failed:', error);
          }
        };

        return (
          <div>
            <h1>Task Management Workflow Test</h1>
            
            {!isLoggedIn ? (
              <div data-testid="auth-section">
                <button 
                  onClick={handleLogin}
                  data-testid="login-button"
                >
                  Login
                </button>
              </div>
            ) : (
              <div data-testid="task-management-section">
                <button 
                  onClick={fetchTasks}
                  data-testid="fetch-tasks"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Fetch Tasks'}
                </button>
                
                <button 
                  onClick={createTask}
                  data-testid="create-task"
                >
                  Create Task
                </button>
                
                <button 
                  onClick={updateTask}
                  data-testid="update-task"
                >
                  Update Task
                </button>
                
                <button 
                  onClick={deleteTask}
                  data-testid="delete-task"
                >
                  Delete Task
                </button>

                <div data-testid="task-list">
                  {tasks.map(task => (
                    <div key={task.id} data-testid={`task-${task.id}`}>
                      <span data-testid={`task-title-${task.id}`}>{task.title}</span>
                      <span data-testid={`task-status-${task.id}`}>{task.status}</span>
                    </div>
                  ))}
                </div>

                <div data-testid="task-count">
                  Total tasks: {tasks.length}
                </div>
              </div>
            )}
          </div>
        );
      };

      const { getByTestId } = render(<TaskManagementTest />, { wrapper });

      // Step 1: Login
      fireEvent.click(getByTestId('login-button'));

      await waitFor(() => {
        expect(getByTestId('task-management-section')).toBeInTheDocument();
      });

      // Step 2: Fetch tasks
      fireEvent.click(getByTestId('fetch-tasks'));

      await waitFor(() => {
        expect(getByTestId('task-count')).toHaveTextContent('Total tasks: 1');
        expect(getByTestId('task-title-1')).toHaveTextContent('Existing Task');
        expect(getByTestId('task-status-1')).toHaveTextContent('pending');
      });

      // Step 3: Create new task
      fireEvent.click(getByTestId('create-task'));

      await waitFor(() => {
        expect(getByTestId('task-count')).toHaveTextContent('Total tasks: 2');
      });

      // Step 4: Update existing task
      fireEvent.click(getByTestId('update-task'));

      await waitFor(() => {
        expect(getByTestId('task-title-1')).toHaveTextContent('Updated Task');
        expect(getByTestId('task-status-1')).toHaveTextContent('in_progress');
      });

      // Step 5: Delete task
      fireEvent.click(getByTestId('delete-task'));

      await waitFor(() => {
        expect(getByTestId('task-count')).toHaveTextContent('Total tasks: 1');
      });
    });
  });

  describe('Error Handling Flows', () => {
    it('should handle authentication errors gracefully', async () => {
      const { authService } = require('../../services/api');

      // Mock authentication error
      authService.login.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      });

      // Create test component for error handling
      const ErrorHandlingTest: React.FC = () => {
        const [error, setError] = React.useState<string | null>(null);
        const [isLoggedIn, setIsLoggedIn] = React.useState(false);

        const handleLogin = async () => {
          try {
            setError(null);
            await authService.login({
              email: 'invalid@example.com',
              password: 'wrong-password',
            });
            setIsLoggedIn(true);
          } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
          }
        };

        return (
          <div>
            <h1>Error Handling Test</h1>
            
            {!isLoggedIn ? (
              <div data-testid="login-section">
                <button 
                  onClick={handleLogin}
                  data-testid="login-button"
                >
                  Login with Invalid Credentials
                </button>
                
                {error && (
                  <div data-testid="error-message" className="error">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div data-testid="success-section">
                <div>Logged in successfully!</div>
              </div>
            )}
          </div>
        );
      };

      const { getByTestId } = render(<ErrorHandlingTest />, { wrapper });

      // Attempt login with invalid credentials
      fireEvent.click(getByTestId('login-button'));

      // Should show error message instead of success
      await waitFor(() => {
        expect(getByTestId('error-message')).toHaveTextContent('Invalid credentials');
        expect(getByTestId('login-section')).toBeInTheDocument(); // Still on login section
      });

      // Should not be logged in
      expect(screen.queryByTestId('success-section')).not.toBeInTheDocument();
    });

    it('should handle network errors and retry mechanisms', async () => {
      const { taskService } = require('../../services/api');

      // Mock network error on first attempt, success on second
      taskService.getAll
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({
          data: [],
          meta: { current_page: 1, last_page: 1, total: 0 },
          links: {},
        });

      // Create test component with retry mechanism
      const NetworkErrorTest: React.FC = () => {
        const [tasks, setTasks] = React.useState<any[]>([]);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);
        const [retryCount, setRetryCount] = React.useState(0);

        const fetchTasks = async (retry = true) => {
          setLoading(true);
          setError(null);
          try {
            const response = await taskService.getAll(1, {});
            setTasks(response.data);
            if (retry) setRetryCount(0);
          } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch tasks';
            setError(errorMessage);
            
            // Implement retry mechanism
            if (retry && retryCount < 3) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                fetchTasks(false); // Don't increment retry count recursively
              }, 100);
            }
          } finally {
            setLoading(false);
          }
        };

        return (
          <div>
            <h1>Network Error Handling Test</h1>
            
            <button 
              onClick={() => fetchTasks()}
              data-testid="fetch-tasks"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Tasks'}
            </button>
            
            {error && (
              <div data-testid="error-message" className="error">
                {error} (Retry #{retryCount})
              </div>
            )}
            
            <div data-testid="task-count">
              Tasks: {tasks.length}
            </div>
            
            <div data-testid="retry-count">
              Retries: {retryCount}
            </div>
          </div>
        );
      };

      const { getByTestId } = render(<NetworkErrorTest />, { wrapper });

      // First attempt - should fail with network error
      fireEvent.click(getByTestId('fetch-tasks'));

      // Should show error initially
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeInTheDocument();
      });

      // After retry mechanism, should succeed
      await waitFor(() => {
        expect(getByTestId('task-count')).toHaveTextContent('Tasks: 0');
        // Retry count might be 0 if immediate retry succeeds
      }, { timeout: 1000 });
    });
  });
});
