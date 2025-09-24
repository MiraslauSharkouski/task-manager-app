import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../tasks/TaskList';
import { Task } from '../../types/tasks';

describe('TaskList Component', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      user_id: 1,
      title: 'Test Task 1',
      description: 'Test description 1',
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
    },
    {
      id: 2,
      user_id: 1,
      title: 'Test Task 2',
      description: 'Test description 2',
      status: 'in_progress',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    },
  ];

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onCreate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <TaskList
        tasks={[]}
        loading={true}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const errorMessage = 'Failed to load tasks';
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error={errorMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render empty state with create button', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('No tasks')).toBeInTheDocument();
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('should render tasks list', () => {
    render(
      <TaskList
        tasks={mockTasks}
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    
    // Check status badges
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskList
        tasks={[mockTasks[0]]}
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskList
        tasks={[mockTasks[0]]}
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it('should call onCreate when create button is clicked in empty state', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const createButton = screen.getByText('New Task');
    fireEvent.click(createButton);

    expect(mockHandlers.onCreate).toHaveBeenCalled();
  });
});
