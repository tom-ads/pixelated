import mongoose from "mongoose";
import request from "supertest";
import User from "../../../api/Model/User";
import { app } from "../../../server";

describe("Auth /register", () => {
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it("allows a user to register with their details", async () => {
    const payload = {
      username: "bob-marley",
      email: "bob.marley@email.com",
      password: "testPassword123!",
      password_confirmation: "testPassword123!",
    };

    const response = await request(app).post("/auth/register").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        username: payload.username,
        email: payload.email,
      })
    );
  });

  it("prevents a user with an existing username from registering an account", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@email.com",
      password: "testPassword123!",
    });
    const payload = {
      username: "bob-marley",
      email: "diff-emaiL@example.com",
      password: "testPassword123!",
      password_confirmation: "testPassword123!",
    };

    const response = await request(app).post("/auth/register").send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Username or email already exists",
    });
  });

  it("prevents a user with an existing email from registering an account", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@email.com",
      password: "testPassword123!",
    });
    const payload = {
      username: "diff-username",
      email: "bob.marley@email.com",
      password: "testPassword123!",
      password_confirmation: "testPassword123!",
    };

    const response = await request(app).post("/auth/register").send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Username or email already exists",
    });
  });
});
