import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ token }) => {
  const backendapi = process.env.REACT_APP_BACKEND_API;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      status,
      dueDate,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendapi}/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        // alert('Task created successfully');
        setTitle('');
        setDescription('');
        setStatus('To Do');
        setDueDate('');
        navigate('/'); 
      } else {
        throw new Error('Failed to create task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a New Task</h2>

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
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            placeholder='yyyy-mm-dd'
            value={dueDate}
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
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
