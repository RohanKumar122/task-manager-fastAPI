import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import delete1 from "../utils/images/delete.png";
import add from "../utils/images/add.png";
import tonggle from "../utils/images/tonggle.png";
import done from "../utils/images/check.png";

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

  const handlecomplete = async (id, currentStatus) => {
    const newStatus = currentStatus === "To Do" ? "Done" : "Done";

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
      <h2 className="text-xl text-red-800 font-bold mb-4">Your Tasks</h2>
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
        <ul className="flex flex-wrap  lg:ml-auto lg:mr-auto justify-center lg:justify-start lg:w-5/6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`font-semibold  p-4  mx-2 my-2  shadow-lg rounded-lg ${
                task.status === "In Progress"
                  ? "bg-yellow-100"
                  : task.status === "To Do"
                  ? "bg-red-100"
                  : task.status === "Done"
                  ? "bg-green-200 text-black-400 "
                  : "text-gray-500 bg-white"
              }`}
              // className="bg-white p-4  mx-2 my-2  shadow-lg rounded-lg"
            >
              {" "}
              {/* Use task.id instead of task._id */}
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p
                className={`font-semibold ${
                  task.status === "In Progress"
                    ? "text-yellow-600"
                    : task.status === "To Do"
                    ? "text-red-500"
                    : task.status === "Done"
                    ? "text-green-700 font-bold"
                    : "text-gray-500"
                }`}
              >
                Status: {task.status}
              </p>
              <div className="mt-2 flex">
                <button
                  onClick={() => handleUpdateStatus(task.id, task.status)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  <div className="flex items-center">
                    <div>
                      <img
                        className="w-4 h-4 mx-1"
                        src={tonggle}
                        alt="tonggle"
                      />
                    </div>

                    <div className="mr-1">Tonggle</div>
                  </div>
                </button>

                {/* DELETE button */}
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

                {/* Done button */}

                <button
                  onClick={() => handlecomplete(task.id, task.status)}
                  className=""
                >
                  <div className="flex  mx-2  items-center">
                    <div className="mr-1">
                      <img className="w-8 h-8 " src={done} alt="Done" />
                    </div>
                    <div className="text-green-500 "></div>
                  </div>
                </button>
              </div>
              <p className="font-semibold font-serif text-green-800 my-2">
  Created : {new Date(task.created_at)
    .toLocaleString('en-GB', {
      timeZone: 'Asia/Kolkata', // Ensures Indian Standard Time (IST)
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', ' - ')
    .replace(' ', '.')}
</p>


            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
