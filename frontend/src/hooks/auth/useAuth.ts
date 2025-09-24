import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from './useAuthQueries';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Используем мутации из React Query
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  return {
    ...context,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    // Состояния мутаций
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    loginError: loginMutation.isError ? (loginMutation.error as Error)?.message : null,
    registerError: registerMutation.isError ? (registerMutation.error as Error)?.message : null,
    logoutError: logoutMutation.isError ? (logoutMutation.error as Error)?.message : null,
  };
};
