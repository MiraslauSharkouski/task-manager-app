import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/api/authService';
import { LoginCredentials, RegisterData } from '../../types/auth';
import { useAuth } from '../auth/useAuth';

// Хук для получения текущего пользователя
export const useCurrentUserQuery = () => {
  const { state } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!state.token,
    staleTime: 1000 * 60 * 30, // 30 минут
  });
};

// Хук для входа
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login: authLogin } = useAuth();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Обновляем состояние аутентификации
      authLogin({
        email: data.user.email,
        password: '', // Не сохраняем пароль
      }).catch(console.error);
      
      // Сохраняем пользователя в кэше
      queryClient.setQueryData(['user', 'current'], data.user);
    },
  });
};

// Хук для регистрации
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { register: authRegister } = useAuth();
  
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Обновляем состояние аутентификации
      authRegister({
        name: data.user.name,
        email: data.user.email,
        password: '', // Не сохраняем пароль
        password_confirmation: '', // Не сохраняем подтверждение
      }).catch(console.error);
      
      // Сохраняем пользователя в кэше
      queryClient.setQueryData(['user', 'current'], data.user);
    },
  });
};

// Хук для выхода
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout: authLogout } = useAuth();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Очищаем кэш пользователя
      queryClient.removeQueries({ queryKey: ['user'] });
      // Выполняем выход из контекста
      authLogout().catch(console.error);
    },
  });
};
