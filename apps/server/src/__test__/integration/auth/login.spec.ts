import request from "supertest";
import { app } from "./../../../server";
import {
  createPartyFactory,
  createPartyMemberFactory,
  createUserFactory,
} from "./../../../database/factories";
import User from "../../../api/Model/User";
import mongoose from "mongoose";

describe("Auth /login", () => {
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it("allows an existing user to login into their account", async () => {
    const user = await createUserFactory({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
    });

    const response = await request(app).post("/auth/login").send({
      username: "bob-marley",
      password: "testPassword123!",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        username: user.username,
        email: "bob.marley@gmail.com",
      })
    );
  });

  it("prevents user with incorrect username from logging in", async () => {
    const payload = {
      username: "incorrect-user",
      password: "testPassword123!",
    };

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toBe(400);
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

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Username or password incorrect, please check your details",
    });
  });

  it("allows an existing user to login and returns party", async () => {
    const authUser = await User.create({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
      password: "testPassword123!",
    });
    const partyMember = createPartyMemberFactory({
      username: authUser.username,
    });
    const party = await createPartyFactory({ members: [partyMember] });

    const payload = {
      username: "bob-marley",
      password: "testPassword123!",
    };

    const response = await request(app).post("/auth/login").send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        username: "bob-marley",
        email: "bob.marley@gmail.com",
      })
    );
    expect(response.body.party).toEqual(party.serialize());
  });
});
