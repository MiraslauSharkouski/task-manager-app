import api from './api';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/register', data);
    return response.data as AuthResponse;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/login', credentials);
    return response.data as AuthResponse;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};
