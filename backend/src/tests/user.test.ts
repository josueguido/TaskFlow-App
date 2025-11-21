

import request from "supertest";
import { app } from "../app";

describe("POST /users/register", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/users/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "TestPassword123"
    });
    expect(res.statusCode).toBe(201);
  });
});
