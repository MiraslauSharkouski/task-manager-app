// Тестовые утилиты для задач
export const testTaskUtils = {
  // Генерация тестовых данных задачи
  generateTestTaskData: () => ({
    title: `Test Task ${Date.now()}`,
    description: 'This is a test task description',
    status: 'pending' as const,
  }),

  // Валидация статуса задачи
  isValidStatus: (status: string): boolean => {
    return ['pending', 'in_progress', 'done'].includes(status);
  },

  // Валидация данных задачи
  validateTaskData: (taskData: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!taskData.title || taskData.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (taskData.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    
    if (taskData.description && taskData.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
    
    if (!testTaskUtils.isValidStatus(taskData.status)) {
      errors.push('Invalid status');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Форматирование тестовых задач
  formatTestTask: (task: any) => ({
    id: task.id || Math.floor(Math.random() * 10000),
    user_id: task.user_id || 1,
    title: task.title || 'Test Task',
    description: task.description || null,
    status: task.status || 'pending',
    created_at: task.created_at || new Date().toISOString(),
    updated_at: task.updated_at || new Date().toISOString(),
    user: {
      id: task.user?.id || 1,
      name: task.user?.name || 'Test User',
      email: task.user?.email || 'test@example.com',
      created_at: task.user?.created_at || new Date().toISOString(),
      updated_at: task.user?.updated_at || new Date().toISOString(),
    },
  }),
};
