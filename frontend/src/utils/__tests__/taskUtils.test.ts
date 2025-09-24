import { testTaskUtils } from '../testTasks';

describe('Task Utilities', () => {
  describe('generateTestTaskData', () => {
    it('should generate valid test task data', () => {
      const taskData = testTaskUtils.generateTestTaskData();
      
      expect(taskData.title).toContain('Test Task');
      expect(taskData.description).toBe('This is a test task description');
      expect(taskData.status).toBe('pending');
    });

    it('should generate unique titles', () => {
      const taskData1 = testTaskUtils.generateTestTaskData();
      const taskData2 = testTaskUtils.generateTestTaskData();
      
      expect(taskData1.title).not.toBe(taskData2.title);
    });
  });

  describe('isValidStatus', () => {
    it('should return true for valid statuses', () => {
      expect(testTaskUtils.isValidStatus('pending')).toBe(true);
      expect(testTaskUtils.isValidStatus('in_progress')).toBe(true);
      expect(testTaskUtils.isValidStatus('done')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(testTaskUtils.isValidStatus('invalid')).toBe(false);
    });
  });

  describe('validateTaskData', () => {
    it('should validate valid task data', () => {
      const taskData = {
        title: 'Valid Task',
        description: 'Valid description',
        status: 'pending',
      };
      
      const result = testTaskUtils.validateTaskData(taskData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject task data without title', () => {
      const taskData = {
        title: '',
        description: 'Valid description',
        status: 'pending',
      };
      
      const result = testTaskUtils.validateTaskData(taskData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should reject task data with too long title', () => {
      const taskData = {
        title: 'A'.repeat(300),
        description: 'Valid description',
        status: 'pending',
      };
      
      const result = testTaskUtils.validateTaskData(taskData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be less than 255 characters');
    });

    it('should reject task data with too long description', () => {
      const taskData = {
        title: 'Valid Title',
        description: 'A'.repeat(1500),
        status: 'pending',
      };
      
      const result = testTaskUtils.validateTaskData(taskData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be less than 1000 characters');
    });

    it('should reject task data with invalid status', () => {
      const taskData = {
        title: 'Valid Title',
        description: 'Valid description',
        status: 'invalid',
      };
      
      const result = testTaskUtils.validateTaskData(taskData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status');
    });
  });

  describe('formatTestTask', () => {
    it('should format task data correctly', () => {
      const rawTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test description',
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
      
      const formattedTask = testTaskUtils.formatTestTask(rawTask);
      
      expect(formattedTask.id).toBe(1);
      expect(formattedTask.title).toBe('Test Task');
      expect(formattedTask.status).toBe('pending');
      expect(formattedTask.user.name).toBe('Test User');
    });

    it('should generate IDs for missing data', () => {
      const rawTask = {
        title: 'Test Task',
      };
      
      const formattedTask = testTaskUtils.formatTestTask(rawTask);
      
      expect(formattedTask.id).toBeDefined();
      expect(typeof formattedTask.id).toBe('number');
    });
  });
});
