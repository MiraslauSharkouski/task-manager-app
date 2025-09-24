import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../tasks/TaskForm';
import { TaskFormData } from '../../types/tasks';

describe('TaskForm Component', () => {
  const mockHandlers = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  const validTaskData: TaskFormData = {
    title: 'Test Task',
    description: 'Test description',
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render create form correctly', () => {
    render(<TaskForm {...mockHandlers} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render edit form correctly', () => {
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

    render(<TaskForm task={mockTask} {...mockHandlers} />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('should call onSubmit with valid data when form is submitted', async () => {
    render(<TaskForm {...mockHandlers} />);

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
    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith(validTaskData);
  });

  it('should show validation errors for empty title', async () => {
    render(<TaskForm {...mockHandlers} />);

    // Try to submit empty form
    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });

  it('should show validation errors for too long title', async () => {
    render(<TaskForm {...mockHandlers} />);

    // Fill form with too long title
    const longTitle = 'A'.repeat(300);
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: longTitle },
    });

    // Submit form
    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Title must be less than 255 characters')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<TaskForm {...mockHandlers} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockHandlers.onCancel).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    render(<TaskForm {...mockHandlers} loading={true} />);

    const submitButton = screen.getByText('Saving...');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should show error message when error prop is provided', () => {
    const errorMessage = 'Failed to save task';
    render(<TaskForm {...mockHandlers} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
