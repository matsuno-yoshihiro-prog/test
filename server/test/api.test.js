import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("Todo API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it("reports health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns seeded todos", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it("creates a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Write tests" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Write tests", done: false });
    expect(res.body.id).toBeTypeOf("number");
  });

  it("rejects an empty title", async () => {
    const res = await request(app).post("/api/todos").send({ title: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("toggles a todo done state", async () => {
    const created = await request(app)
      .post("/api/todos")
      .send({ title: "Toggle me" });
    const res = await request(app)
      .patch(`/api/todos/${created.body.id}`)
      .send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it("deletes a todo", async () => {
    const created = await request(app)
      .post("/api/todos")
      .send({ title: "Delete me" });
    const res = await request(app).delete(`/api/todos/${created.body.id}`);
    expect(res.status).toBe(200);

    const list = await request(app).get("/api/todos");
    expect(list.body.find((t) => t.id === created.body.id)).toBeUndefined();
  });

  it("404s for a missing todo", async () => {
    const res = await request(app).patch("/api/todos/9999").send({ done: true });
    expect(res.status).toBe(404);
  });
});
