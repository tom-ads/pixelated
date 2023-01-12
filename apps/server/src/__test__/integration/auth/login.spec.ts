import request from "supertest";
import User, { UserDocument } from "../../../api/Model/User";
import { app } from "./../../../server";
import {
  createPartyFactory,
  createPartyMemberFactory,
  createUserFactory,
} from "./../../../database/factories";

describe("Auth /login", () => {
  let authUser: UserDocument;

  beforeEach(async () => {
    authUser = await createUserFactory({
      username: "bob-marley",
      email: "bob.marley@gmail.com",
    });
  });

  it("allows an existing user to login into their account", async () => {
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
    const partyMember = createPartyMemberFactory({
      username: authUser.username,
    });
    const party = await createPartyFactory({ members: [partyMember] });

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
    expect(response.body.party).toEqual(party.serialize());
  });
});
