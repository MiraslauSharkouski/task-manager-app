import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../../hooks/tasks/useTasks';
import TaskForm from '../../components/tasks/TaskForm';
import { TaskFormData } from '../../types/tasks';

const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    isCreating,
    isUpdating,
    createError,
    updateError,
  } = useTasks();
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  const editingTask = id ? tasks.find(task => task.id === parseInt(id)) : undefined;

  const handleSubmit = async (taskData: TaskFormData) => {
    setSubmitError(null);
    
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      navigate('/tasks');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save task';
      setSubmitError(errorMessage);
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (id && loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>
      
      {/* Submit Errors */}
      {(submitError || createError || updateError) && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">
            {submitError || createError || updateError}
          </span>
        </div>
      )}

      <TaskForm
        task={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isCreating || isUpdating}
        error={null}
      />
    </div>
  );
};

export default TaskFormPage;
