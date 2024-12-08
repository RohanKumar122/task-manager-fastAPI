import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ token, taskToEdit = null }) => {
  const backendapi = process.env.REACT_APP_BACKEND_API;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [due_date, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Populate fields if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.due_date ? taskToEdit.due_date.slice(0, 16) : ''); // Format for datetime-local
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      due_date,
    };

    setLoading(true);
    setError(null);

    try {
      const url = taskToEdit
        ? `${backendapi}/tasks/${taskToEdit.id}` // Update URL
        : `${backendapi}/tasks`; // Create URL
      const method = taskToEdit ? 'PUT' : 'POST'; // HTTP method

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        // Reset the form or navigate based on the operation
        if (!taskToEdit) {
          setTitle('');
          setDescription('');
          setStatus('To Do');
          setDueDate('');
        }
        navigate('/');
      } else {
        throw new Error(taskToEdit ? 'Failed to update task' : 'Failed to create task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {taskToEdit ? 'Update Task' : 'Create a New Task'}
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
            required
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            id="due_date"
            type="datetime-local"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
          disabled={loading}
        >
          {loading ? (taskToEdit ? 'Updating...' : 'Creating...') : (taskToEdit ? 'Update Task' : 'Create Task')}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
