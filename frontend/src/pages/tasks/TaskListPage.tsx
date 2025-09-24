import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../hooks/tasks/useTasks';
import TaskList from '../../components/tasks/TaskList';
import TaskModal from '../../components/tasks/TaskModal';
import { Task } from '../../types/tasks';

const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Auto-hide success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setSuccessMessage('Task deleted successfully');
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleSubmitTask = async (taskData: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setSuccessMessage('Task updated successfully');
      } else {
        await createTask(taskData);
        setSuccessMessage('Task created successfully');
      }
      setShowModal(false);
    } catch (err) {
      console.error('Submit task error:', err);
      throw err;
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={handleCreateTask}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Task
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onCreate={handleCreateTask}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        task={editingTask || undefined}
      />
    </div>
  );
};

export default TaskListPage;
