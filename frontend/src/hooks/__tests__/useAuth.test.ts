import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../auth/useAuth';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock auth service
jest.mock('../../services/api/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.token).toBeNull();
  });

  it('should handle login successfully', async () => {
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

    const { authService } = require('../../services/api/authService');
    authService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.user).toEqual(mockUser);
    expect(result.current.state.token).toBe('test-token');
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should handle login failure', async () => {
    const { authService } = require('../../services/api/authService');
    authService.login.mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      })
    ).rejects.toThrow('Login failed');

    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBeNull();
  });

  it('should handle logout successfully', async () => {
    // First login
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

    const { authService } = require('../../services/api/authService');
    authService.login.mockResolvedValueOnce(mockLoginResponse);
    authService.logout.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.state.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.token).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should handle register successfully', async () => {
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

    const { authService } = require('../../services/api/authService');
    authService.register.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
    });

    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.user).toEqual(mockUser);
    expect(result.current.state.token).toBe('test-token');
  });
});
