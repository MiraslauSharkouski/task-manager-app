import { formatDate, getStatusColor, getStatusText } from '../index';

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2023-01-01T10:00:00.000000Z';
      const formatted = formatDate(dateString);
      
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('2023');
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle invalid date gracefully', () => {
      const dateString = 'invalid-date';
      expect(() => formatDate(dateString)).not.toThrow();
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for pending status', () => {
      const color = getStatusColor('pending');
      expect(color).toContain('yellow');
    });

    it('should return correct color for in_progress status', () => {
      const color = getStatusColor('in_progress');
      expect(color).toContain('blue');
    });

    it('should return correct color for done status', () => {
      const color = getStatusColor('done');
      expect(color).toContain('green');
    });

    it('should return default color for unknown status', () => {
      const color = getStatusColor('unknown');
      expect(color).toContain('gray');
    });
  });

  describe('getStatusText', () => {
    it('should return correct text for pending status', () => {
      const text = getStatusText('pending');
      expect(text).toBe('Pending');
    });

    it('should return correct text for in_progress status', () => {
      const text = getStatusText('in_progress');
      expect(text).toBe('In Progress');
    });

    it('should return correct text for done status', () => {
      const text = getStatusText('done');
      expect(text).toBe('Done');
    });

    it('should return original status for unknown status', () => {
      const text = getStatusText('unknown');
      expect(text).toBe('unknown');
    });
  });
});
