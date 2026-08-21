import express from "express";
import cors from "cors";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let nextId = 1;
  const todos = [];

  const seed = (title, done = false) => {
    todos.push({ id: nextId++, title, done });
  };
  seed("Set up the Cloud Agent environment", true);
  seed("Run the app end to end");

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/todos", (_req, res) => {
    res.json(todos);
  });

  app.post("/api/todos", (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    const todo = { id: nextId++, title, done: false };
    todos.push(todo);
    res.status(201).json(todo);
  });

  app.patch("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }
    if (typeof req.body?.done === "boolean") {
      todo.done = req.body.done;
    }
    if (typeof req.body?.title === "string" && req.body.title.trim()) {
      todo.title = req.body.title.trim();
    }
    res.json(todo);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "todo not found" });
    }
    const [removed] = todos.splice(index, 1);
    res.json(removed);
  });

  return app;
}
