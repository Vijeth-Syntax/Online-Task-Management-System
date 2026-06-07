import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/tasks";

  // Fetch Tasks (READ)
  const fetchTasks = async (statusFilter = "All") => {
    try {
      const response = await fetch(`${API_URL}?status=${statusFilter}`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  // Handle Submit (CREATE with Form Validation)
  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend Form Validation
    if (!taskTitle.trim()) {
      setError("Task title cannot be blank!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle, priority }),
      });

      if (response.ok) {
        setTaskTitle("");
        fetchTasks(filter);
      } else {
        const errData = await response.json();
        setError(errData.error);
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  // Toggle Status (UPDATE)
  const toggleTaskStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });
      if (response.ok) fetchTasks(filter);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete Task (DELETE)
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) fetchTasks(filter);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="app-container">
      <h2>📋 Task Management System</h2>

      {/* Task Input Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Enter daily task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {/* Filter Tabs */}
      <div className="filter-container">
        {["All", "Pending", "Completed"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active-filter" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Task List Rendering */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.status === "Completed" ? "completed" : ""}`}
            >
              <div
                onClick={() => toggleTaskStatus(task.id)}
                style={{ cursor: "pointer" }}
              >
                <span
                  className={`priority-badge ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
                <p className="task-text">{task.title}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
