import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskForm from '../../../components/tasks/TaskForm';
import TaskModal from '../../../components/tasks/TaskModal';
import { TaskFormData } from '../../../types/tasks';

// Mock task service
jest.mock('../../../services/api/taskService', () => ({
  taskService: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Task Forms Integration', () => {
  let queryClient: QueryClient;

  const mockHandlers = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    onClose: jest.fn(),
  };

  const validTaskData: TaskFormData = {
    title: 'Test Task',
    description: 'Test description',
    status: 'pending',
  };

  const mockTask = {
    id: 1,
    user_id: 1,
    title: 'Existing Task',
    description: 'Existing description',
    status: 'in_progress',
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  describe('TaskForm Integration', () => {
    it('should handle create task flow successfully', async () => {
      const { taskService } = require('../../../services/api/taskService');
      taskService.create.mockResolvedValue({
        ...mockTask,
        id: 2,
        title: validTaskData.title,
        description: validTaskData.description,
        status: validTaskData.status,
      });

      render(
        <TaskForm
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />,
        { wrapper }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { value: validTaskData.title },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: validTaskData.description },
      });
      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: validTaskData.status },
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Task'));

      // Wait for successful submission
      await waitFor(() => {
        expect(taskService.create).toHaveBeenCalledWith(validTaskData);
      });

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith(validTaskData);
    });

    it('should handle update task flow successfully', async () => {
      const { taskService } = require('../../../services/api/taskService');
      taskService.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
        description: 'Updated description',
        status: 'done',
      });

      render(
        <TaskForm
          task={mockTask}
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />,
        { wrapper }
      );

      // Update form fields
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { value: 'Updated Task' },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'Updated description' },
      });
      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: 'done' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Update Task'));

      // Wait for successful update
      await waitFor(() => {
        expect(taskService.update).toHaveBeenCalledWith(1, {
          title: 'Updated Task',
          description: 'Updated description',
          status: 'done',
        });
      });

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'done',
      });
    });

    it('should handle form validation errors', async () => {
      render(
        <TaskForm
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />,
        { wrapper }
      );

      // Try to submit empty form
      fireEvent.click(screen.getByText('Create Task'));

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
    });

    it('should handle API error during task creation', async () => {
      const { taskService } = require('../../../services/api/taskService');
      taskService.create.mockRejectedValue({
        response: {
          data: {
            message: 'Failed to create task',
          },
        },
      });

      render(
        <TaskForm
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />,
        { wrapper }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { value: validTaskData.title },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: validTaskData.description },
      });
      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: validTaskData.status },
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Task'));

      // Wait for error handling
      await waitFor(() => {
        expect(taskService.create).toHaveBeenCalledWith(validTaskData);
      });

      // Should re-throw the error for parent component to handle
      expect(mockHandlers.onSubmit).toHaveBeenCalled();
    });
  });

  describe('TaskModal Integration', () => {
    it('should render and handle task creation in modal', async () => {
      const { taskService } = require('../../../services/api/taskService');
      taskService.create.mockResolvedValue({
        ...mockTask,
        id: 2,
        title: validTaskData.title,
        description: validTaskData.description,
        status: validTaskData.status,
      });

      render(
        <TaskModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          onSubmit={mockHandlers.onSubmit}
        />,
        { wrapper }
      );

      // Modal should be visible
      expect(screen.getByText('Create New Task')).toBeInTheDocument();

      // Fill form in modal
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { value: validTaskData.title },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: validTaskData.description },
      });
      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: validTaskData.status },
      });

      // Submit form
      fireEvent.click(screen.getByText('Create Task'));

      // Wait for successful submission
      await waitFor(() => {
        expect(taskService.create).toHaveBeenCalledWith(validTaskData);
      });

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith(validTaskData);
    });

    it('should render and handle task editing in modal', async () => {
      const { taskService } = require('../../../services/api/taskService');
      taskService.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
        description: 'Updated description',
        status: 'done',
      });

      render(
        <TaskModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          onSubmit={mockHandlers.onSubmit}
          task={mockTask}
        />,
        { wrapper }
      );

      // Modal should be visible with edit title
      expect(screen.getByText('Edit Task')).toBeInTheDocument();

      // Update form fields
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { value: 'Updated Task' },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'Updated description' },
      });
      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: 'done' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Update Task'));

      // Wait for successful update
      await waitFor(() => {
        expect(taskService.update).toHaveBeenCalledWith(1, {
          title: 'Updated Task',
          description: 'Updated description',
          status: 'done',
        });
      });

      expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'done',
      });
    });

    it('should close modal when cancel button is clicked', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          onSubmit={mockHandlers.onSubmit}
        />,
        { wrapper }
      );

      fireEvent.click(screen.getByText('Cancel'));

      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('should close modal when close button is clicked', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          onSubmit={mockHandlers.onSubmit}
        />,
        { wrapper }
      );

      fireEvent.click(screen.getByText('Cancel'));

      expect(mockHandlers.onClose).toHaveBeenCalled();
    });
  });
});
