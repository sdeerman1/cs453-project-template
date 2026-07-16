import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../src/server.ts";

let dynamicId;

describe("Project Milestone 1", () => {
  test("GET /health returns status ok", async () => {

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toMatchObject({ status: "ok" });
  });

  test("GET /db-health returns status ok", async () => {

    const response = await request(app)
        .get("/db-health")
        .expect(200);

    expect(response.body).toMatchObject({ status: "ok" });
  });

  test("GET /tasks returns a list of all tasks", async () => {
    const result = await request(app).get("/tasks");

    expect(result.body).toBeInstanceOf(Array);
  });

  test("POST /tasks creates a new task", async () => {
    const result = await request(app)
      .post("/tasks")
      .send({
        "title": "Final exam",
        "description": "Cumulative final exam",
        "status": "todo"
      })
      .expect('Content-Type', /json/)
      .expect(201);

    dynamicId = result.body.task.id;

    const createdDate = new Date(result.body.task.created_at);
    const updatedDate = new Date(result.body.task.updated_at);

    expect(result.body.task).toHaveProperty('id');
    expect(result.body.task.id).toBeDefined();
    expect(result.body.task.title).toEqual("Final exam");
    expect(result.body.task.description).toEqual("Cumulative final exam");
    expect(result.body.task.status).toEqual("todo");
    expect(createdDate).toBeInstanceOf(Date);
    expect(updatedDate).toBeInstanceOf(Date);
  });

  test("GET /tasks/:id can retrieve a task by its ID", async () => {
    const result = await request(app).get(`/tasks/${dynamicId}`);

    const createdDate = new Date(result.body.created_at);
    const updatedDate = new Date(result.body.updated_at);

    expect(result.body).toHaveProperty('id');
    expect(result.body.id).toBeDefined();
    expect(result.body.title).toEqual("Final exam");
    expect(result.body.description).toEqual("Cumulative final exam");
    expect(result.body.status).toEqual("todo");
    expect(createdDate).toBeInstanceOf(Date);
    expect(updatedDate).toBeInstanceOf(Date);
  });

  test("PATCH /tasks/:id updates an existing task", async () => {
    const result = await request(app)
      .patch(`/tasks/${dynamicId}`)
      .send({
        "title": "Midterm",
      })
      .expect('Content-Type', /json/);

    const createdDate = new Date(result.body.task.created_at);
    const updatedDate = new Date(result.body.task.updated_at);

    expect(result.body.task).toHaveProperty('id');
    expect(result.body.task.id).toBeDefined();
    expect(result.body.task.title).toEqual("Midterm");
    expect(result.body.task.description).toEqual("Cumulative final exam");
    expect(result.body.task.status).toEqual("todo");
    expect(createdDate).toBeInstanceOf(Date);
    expect(updatedDate).toBeInstanceOf(Date);
  });

  test("PATCH /tasks/:id updates an existing task", async () => {
    const result = await request(app)
      .patch(`/tasks/${dynamicId}`)
      .send({
        "description": "Midterm exam covering modules 1-3",
      })
      .expect('Content-Type', /json/);

        const createdDate = new Date(result.body.task.created_at);
    const updatedDate = new Date(result.body.task.updated_at);

    expect(result.body.task).toHaveProperty('id');
    expect(result.body.task.id).toBeDefined();
    expect(result.body.task.title).toEqual("Midterm");
    expect(result.body.task.description).toEqual("Midterm exam covering modules 1-3");
    expect(result.body.task.status).toEqual("todo");
    expect(createdDate).toBeInstanceOf(Date);
    expect(updatedDate).toBeInstanceOf(Date);
  });

  test("DELETE /tasks/:id deletes an existing task", async () => {
    const result = await request(app).delete(`/tasks/${dynamicId}`);

    expect(result.status).toEqual(204);
  });

  test("a missing task returns 404, GET", async () => {
    const result = await request(app).get("/tasks/1000");

    expect(result.status).toEqual(404);
    expect(result.body).toHaveProperty("error");
  });

  test("a missing task returns 404, PATCH", async () => {
    const result = await request(app)
      .patch("/tasks/1000")
      .send({
        "title": "Sit back and relax",
      })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(result.body).toHaveProperty("error");
  });

  test("error handling for title being nonempty string, POST", async () => {
    const result = await request(app)
      .post("/tasks")
      .send({
        "title": "",
        "description": "forgot a title",
        "status": "todo"
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  test("error handling for title being nonempty string, PATCH", async () => {
    const result = await request(app)
      .patch(`/tasks/${dynamicId}`)
      .send({
        "title": "",
        "description": "forgot a title",
        "status": "todo"
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

});