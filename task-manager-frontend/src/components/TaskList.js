import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import delete1 from "../utils/images/delete.png";
import add from "../utils/images/add.png";
import tonggle from "../utils/images/tonggle.png";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendapi = process.env.REACT_APP_BACKEND_API;
  useEffect(() => {
    // Fetch tasks from backend
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendapi}/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        console.log("Fetched tasks:", data); // Add console log to inspect the data
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err); // Log the error for better debugging
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backendapi}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id)); // Remove deleted task from the list
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "To Do" ? "In Progress" : "To Do";

    try {
      const response = await fetch(`${backendapi}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Only updating the status
      });

      if (response.ok) {
        // Update the task in the state by mapping through the tasks
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-800 z-50">
        <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg">
          <div className="w-6 h-6 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <span className="text-xl text-gray-700">Loading tasks...</span>
        </div>
      </div>
    );
    
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      <Link
        to="/add"
        className="bg-blue-500 text-white p-2 rounded mb-4 inline-block"
      >
        <div className="flex items-center">
          <div className="mr-1">Add New</div>
          <div>
            <img className="w-6 h-6" src={add} alt="Add new item" />
          </div>
        </div>
      </Link>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="space-y-4 b">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white p-4 shadow-lg rounded-lg">
              {" "}
              {/* Use task.id instead of task._id */}
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p
          className={`font-semibold ${
            task.status === 'In Progress'
              ? 'text-yellow-500'
              : task.status === 'To Do'
              ? 'text-red-500'
              : task.status === 'Done'
              ? 'text-green-500'
              : 'text-gray-500' // Default color if the status is unknown
          }`}
        >
          Status: {task.status}
        </p>
              <div className="mt-2">
                <button
                  onClick={() => handleUpdateStatus(task.id, task.status)} // Toggle status by task.id
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  <div className="flex items-center">
                    <div className="mr-1">Tonggle</div>
                    <div>
                      <img
                        className="w-4 h-4"
                        src={tonggle}
                        alt="Add new item"
                      />
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(task.id)} // Use task.id for delete action
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <div className="flex flex-row items-center  ">
                    <img
                      className="h-4 w-4 mx-2  justify-center"
                      src={delete1}
                      alt="logo"
                    />

                    <div className="text-white mr-2">Delete</div>
                  </div>
                </button>
              </div>
              <p className=" font-semibold font-serif text-green-800 my-2">
                Created At: {new Date(task.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
