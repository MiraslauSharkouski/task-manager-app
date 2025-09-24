import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterData } from '../types/auth';
import api from '../services/api';

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_FAIL':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Проверяем валидность токена, получая данные пользователя
      api.get('/user')
        .then((response) => {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data, token },
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          dispatch({ type: 'AUTH_FAIL' });
        });
    } else {
      dispatch({ type: 'AUTH_FAIL' });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/login', credentials);
      const { access_token, user } = response.data;

      localStorage.setItem('auth_token', access_token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access_token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL' });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/register', data);
      const { access_token, user } = response.data;

      localStorage.setItem('auth_token', access_token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access_token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/user');
      dispatch({ type: 'SET_USER', payload: response.data });
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    state,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
