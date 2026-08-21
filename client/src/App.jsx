import { useEffect, useState } from "react";

const api = {
  async list() {
    const res = await fetch("/api/todos");
    if (!res.ok) throw new Error("Failed to load todos");
    return res.json();
  },
  async create(title) {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },
  async toggle(id, done) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },
  async remove(id) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete todo");
    return res.json();
  },
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setTodos(await api.list());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    try {
      await api.create(value);
      setTitle("");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <main className="app">
      <header className="app__header">
        <h1>Todo</h1>
        <p className="app__subtitle">Cloud Agent environment demo</p>
      </header>

      <form className="add" onSubmit={handleAdd}>
        <input
          className="add__input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo title"
        />
        <button className="add__button" type="submit">
          Add
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <li key={todo.id} className={`item ${todo.done ? "item--done" : ""}`}>
              <label className="item__label">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => api.toggle(todo.id, !todo.done).then(refresh)}
                />
                <span>{todo.title}</span>
              </label>
              <button
                className="item__delete"
                onClick={() => api.remove(todo.id).then(refresh)}
                aria-label={`Delete ${todo.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="app__footer muted">
        {remaining} item{remaining === 1 ? "" : "s"} left
      </footer>
    </main>
  );
}
