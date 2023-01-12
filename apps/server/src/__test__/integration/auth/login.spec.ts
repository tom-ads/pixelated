import request from "supertest";
import Party from "../../../api/Model/Party";
import User from "../../../api/Model/User";
import { app } from "./../../../server";

describe("Auth /login", () => {
  it("allows an existing user to login into their account", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
      password: "testPassword123!",
    });

    const payload = {
      username: "bob-marley",
      password: "testPassword123!",
    };

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        username: "bob-marley",
        email: "bob.marley@gmail.com",
      })
    );
  });

  it("prevents user with incorrect username from logging in", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
      password: "testPassword123!",
    });

    const payload = {
      username: "incorrect-user",
      password: "testPassword123!",
    };

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: "Username or password incorrect, please check your details",
    });
  });

  it("prevents user with incorrect password from logging in", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
      password: "testPassword123!",
    });

    const payload = {
      username: "bob-marley",
      password: "incorrectPassword123!",
    };

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: "Username or password incorrect, please check your details",
    });
  });

  it("allows an existing user to login, and returns party they are still in", async () => {
    await User.create({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
      password: "testPassword123!",
    });

    const payload = {
      username: "bob-marley",
      password: "testPassword123!",
    };

    const party = await Party.create({
      name: "test-party",
      code: "123",
      isPlaying: false,
      correctGuesses: 0,
      round: 1,
      members: [
        {
          username: payload.username,
          isOwner: true,
          isDrawer: false,
          guessedPos: 0,
          rounds: 0,
          score: 0,
        },
      ],
    });

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        username: "bob-marley",
        email: "bob.marley@gmail.com",
      })
    );
    expect(response.body.party).toEqual(party.serialize());
  });
});
