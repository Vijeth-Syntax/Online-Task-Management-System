import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock Database Array (Simulating SQL records)
let tasks = [
  {
    id: 1,
    title: "Review React Components",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    title: "Database Optimization",
    status: "Completed",
    priority: "Medium",
  },
];

// 1. READ ALL (With Filtering Logic)
app.get("/api/tasks", (req, res) => {
  const { status } = req.query;
  if (status && status !== "All") {
    const filteredTasks = tasks.filter((task) => task.status === status);
    return res.json(filteredTasks);
  }
  res.json(tasks);
});

// 2. CREATE (With Form Validation backend-side)
app.post("/api/tasks", (req, res) => {
  const { title, priority } = req.body;

  // Server-side validation
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Task title is required" });
  }

  const newTask = {
    id: Date.now(), // Unique ID generation
    title,
    status: "Pending",
    priority: priority || "Low",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 3. UPDATE (Toggle status)
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Toggle status between Pending and Completed
  tasks[taskIndex].status =
    tasks[taskIndex].status === "Pending" ? "Completed" : "Pending";
  res.json(tasks[taskIndex]);
});

// 4. DELETE
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== parseInt(id));

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task successfully deleted", id: parseInt(id) });
});

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
