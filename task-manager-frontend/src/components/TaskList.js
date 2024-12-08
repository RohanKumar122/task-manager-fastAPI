import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import delete1 from "../utils/images/delete.png";
import add from "../utils/images/add.png";
import tonggle from "../utils/images/tonggle.png";
import done from "../utils/images/check.png";
import edit from "../utils/images/edit.png";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // State for dropdown filter
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

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
          throw new Error("Failed to fetch tasks!! Please login again.");
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError("Failed to fetch tasks!! Please login again.");
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

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Update filter state based on dropdown selection
  };

  const filteredTasks =
    filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter);

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
    <div className="flex flex-col rounded-xl my-2 items-center">
      <h2 className="text-xl text-red-800 font-bold my-2 mb-4">Your Tasks</h2>

      <div className="flex flex-row justify-between w-3/7 h-full mx-auto">
        <div className="flex justify-end mx-8">
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
        </div>

        <select
          value={filter}
          onChange={handleFilterChange}
          className="mb-4 flex flex-row justify-end p-2 border rounded border-gray-500 bg-gray-50"
        >
          <option value="ALL">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="flex flex-wrap lg:ml-auto lg:mr-auto justify-center lg:justify-start lg:w-5/6">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`font-semibold p-4 mx-2 my-2 shadow-lg rounded-lg ${
                task.status === "In Progress"
                  ? "bg-yellow-100"
                  : task.status === "To Do"
                  ? "bg-red-100"
                  : task.status === "Done"
                  ? "bg-green-200 text-black-400 "
                  : "text-gray-500 bg-white"
              }`}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{task.title}</h3>
                <div className="hover:cursor-pointer" onClick={() => {
                    setTaskToEdit(task);
                    setIsEditing(true); 
                  }} >


                  <img className="w-6 h-6" src={edit} alt="description" />
                </div>
              </div>
              <p className="text-gray-600 my-2">{task.description}</p>
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
                  <div className="flex mx-2 items-center">
                    <div className="mr-1">
                      <img className="w-8 h-8 " src={done} alt="Done" />
                    </div>
                    <div className="text-green-500 "></div>
                  </div>
                </button>
              </div>

              <p className="font-semibold text-red-800 my-2">
                Due :{" "}
                {new Date(task.due_date)
                  .toLocaleString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", " , ")
                  .replace(" ", ".")
                  .replace(" ", ".")}
              </p>

              <p className="font-thin text-gray-500 my-2">
                Created :{" "}
                {new Date(task.created_at)
                  .toLocaleString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", " , ")
                  .replace(" ", ".")
                  .replace(" ", ".")}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Popup Form for Editing Task */}
      {isEditing && taskToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(
                    `${backendapi}/tasks/${taskToEdit.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(taskToEdit),
                    }
                  );
                  if (response.ok) {
                    setTasks((prevTasks) =>
                      prevTasks.map((task) =>
                        task.id === taskToEdit.id ? taskToEdit : task
                      )
                    );
                    setIsEditing(false);
                  } else {
                    throw new Error("Failed to update task");
                  }
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={taskToEdit?.title || ""}
                  onChange={(e) =>
                    setTaskToEdit({ ...taskToEdit, title: e.target.value })
                  }
                  className="block w-full p-2 border rounded"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={taskToEdit?.description || ""}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      description: e.target.value,
                    })
                  }
                  className="block w-full p-2 border rounded"
                ></textarea>
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-medium">Status</label>
                <select
                  value={taskToEdit?.status || ""}
                  onChange={(e) =>
                    setTaskToEdit({ ...taskToEdit, status: e.target.value })
                  }
                  className="block w-full p-2 border rounded"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-medium">Due Date</label>
                <input
                  className="block w-full p-2 border rounded"
                  type="datetime-local"
                  value={taskToEdit.due_date}
                  onChange={(e) =>
                    setTaskToEdit({ ...taskToEdit, due_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
