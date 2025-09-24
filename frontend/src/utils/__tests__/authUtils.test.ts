import { testAuthUtils } from '../testAuth';

describe('Authentication Utilities', () => {
  describe('generateTestUserData', () => {
    it('should generate valid test user data', () => {
      const userData = testAuthUtils.generateTestUserData();
      
      expect(userData.name).toBe('Test User');
      expect(userData.email).toContain('@example.com');
      expect(userData.password).toBe('password123');
      expect(userData.password_confirmation).toBe('password123');
    });

    it('should generate unique email addresses', () => {
      const userData1 = testAuthUtils.generateTestUserData();
      const userData2 = testAuthUtils.generateTestUserData();
      
      expect(userData1.email).not.toBe(userData2.email);
    });
  });

  describe('isTokenValid', () => {
    it('should return false for null token', () => {
      const result = testAuthUtils.isTokenValid(null);
      expect(result).toBe(false);
    });

    it('should return false for empty token', () => {
      const result = testAuthUtils.isTokenValid('');
      expect(result).toBe(false);
    });

    it('should return true for valid token', () => {
      const result = testAuthUtils.isTokenValid('valid-token-string');
      expect(result).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      const result = testAuthUtils.isValidEmail('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false for invalid email', () => {
      const result = testAuthUtils.isValidEmail('invalid-email');
      expect(result).toBe(false);
    });

    it('should return false for empty email', () => {
      const result = testAuthUtils.isValidEmail('');
      expect(result).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid password', () => {
      const result = testAuthUtils.isValidPassword('password123');
      expect(result).toBe(true);
    });

    it('should return false for too short password', () => {
      const result = testAuthUtils.isValidPassword('123');
      expect(result).toBe(false);
    });

    it('should return false for empty password', () => {
      const result = testAuthUtils.isValidPassword('');
      expect(result).toBe(false);
    });
  });
});
