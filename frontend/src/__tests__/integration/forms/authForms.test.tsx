import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import LoginForm from '../../../components/auth/LoginForm';
import RegisterForm from '../../../components/auth/RegisterForm';

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock authService
jest.mock('../../../services/api/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe('Authentication Forms Integration', () => {
  const mockHandlers = {
    onSwitchToRegister: jest.fn(),
    onSwitchToLogin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('LoginForm Integration', () => {
    it('should handle successful login flow', async () => {
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

      renderWithProviders(<LoginForm onSwitchToRegister={mockHandlers.onSwitchToRegister} />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Sign in'));

      // Wait for successful login
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Check that token is stored
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should handle login error and display error message', async () => {
      const { authService } = require('../../../services/api/authService');
      authService.login.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      });

      renderWithProviders(<LoginForm onSwitchToRegister={mockHandlers.onSwitchToRegister} />);

      // Fill form with invalid credentials
      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'invalid@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'wrong-password' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Sign in'));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Token should not be stored
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should switch to register form when link is clicked', () => {
      renderWithProviders(<LoginForm onSwitchToRegister={mockHandlers.onSwitchToRegister} />);

      fireEvent.click(screen.getByText("Don't have an account? Register here"));

      expect(mockHandlers.onSwitchToRegister).toHaveBeenCalled();
    });

    it('should validate form fields before submission', async () => {
      renderWithProviders(<LoginForm onSwitchToRegister={mockHandlers.onSwitchToRegister} />);

      // Try to submit empty form
      fireEvent.click(screen.getByText('Sign in'));

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });
  });

  describe('RegisterForm Integration', () => {
    it('should handle successful registration flow', async () => {
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
      authService.register.mockResolvedValue(mockResponse);

      renderWithProviders(<RegisterForm onSwitchToLogin={mockHandlers.onSwitchToLogin} />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Account'));

      // Wait for successful registration
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123',
        });
      });

      // Check that token is stored
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should handle password mismatch validation', async () => {
      renderWithProviders(<RegisterForm onSwitchToLogin={mockHandlers.onSwitchToLogin} />);

      // Fill form with mismatched passwords
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'different-password' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Account'));

      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should switch to login form when link is clicked', () => {
      renderWithProviders(<RegisterForm onSwitchToLogin={mockHandlers.onSwitchToLogin} />);

      fireEvent.click(screen.getByText('Already have an account? Sign in here'));

      expect(mockHandlers.onSwitchToLogin).toHaveBeenCalled();
    });

    it('should validate form fields before submission', async () => {
      renderWithProviders(<RegisterForm onSwitchToLogin={mockHandlers.onSwitchToLogin} />);

      // Try to submit empty form
      fireEvent.click(screen.getByText('Create Account'));

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(screen.getByText('Password confirmation is required')).toBeInTheDocument();
      });
    });
  });
});
