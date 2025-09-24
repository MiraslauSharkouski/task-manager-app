// Тестовые утилиты для аутентификации
export const testAuthUtils = {
  // Генерация тестовых данных
  generateTestUserData: () => ({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    password_confirmation: 'password123',
  }),

  // Проверка валидности токена
  isTokenValid: (token: string | null): boolean => {
    if (!token) return false;
    try {
      // Простая проверка формата токена
      return token.length > 10;
    } catch {
      return false;
    }
  },

  // Проверка валидности email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Проверка валидности пароля
  isValidPassword: (password: string): boolean => {
    return password.length >= 8;
  },
};
