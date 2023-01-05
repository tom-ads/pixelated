// dont pull env when in production, as the host needs to handle this
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import validationMiddleware from "./api/Middleware/ValidationMiddleware";
import { asClass, asValue, createContainer } from "awilix";
import AuthController from "./api/Controller/AuthController";
import UserService from "./api/Service/UserService";
import SessionService from "./api/Service/SessionService";
import MongoManager from "./database/manager";
import session from "express-session";
import CorsConfig from "./config/cors";
import http from "http";
import PartyService, { PartyServiceContract } from "./api/Service/PartyService";
import { PartyDocument } from "./api/Model/Party";
import { CreatePartyDto } from "./api/Service/PartyService/dto";
import SocketEvent from "./api/Enum/SocketEvent";
import { socketResponse } from "./helpers";
import SocketStatus from "./api/Enum/SocketStatus";
import JoinPartyDto from "./api/Service/PartyService/dto/JoinParty";
import SocketError from "./api/Enum/SocketError";
import { UserDocument } from "./api/Model/User";
import { PartyChannel } from "./api/Channels/PartyChannel";

// Create server
export const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Configure express
app.use(express.json());
app.use(validationMiddleware);
app.use(cors(CorsConfig));

export const container = createContainer({
  injectionMode: "CLASSIC",
}).register({
  // Controllers
  authController: asClass(AuthController),

  // Services
  userService: asClass(UserService).scoped(),
  sessionService: asClass(SessionService).scoped(),
  partyService: asClass(PartyService).scoped(),

  // Configs
  connectionString: asValue(process.env.MONGO_CONNECTION_URL),

  // Database
  db: asClass(MongoManager).classic(),

  // Channels
  partyChannel: asClass(PartyChannel).scoped(),
});

(async function () {
  await container.resolve("db").createConnection();
})();

import { sessionConfig } from "./config/session";
const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

app.post("/auth/register", container.resolve("authController").register);
app.post("/auth/login", container.resolve("authController").login);
app.get("/auth/session", container.resolve("authController").session);

server.listen(process.env.APP_PORT, () => {
  console.log(`[API] Started on port ${process.env.APP_PORT}`);
});

io.use((socket, next) => {
  sessionMiddleware(
    socket.request as Request,
    {} as Response,
    next as NextFunction
  );
});

io.use(async (socket, next) => {
  const session = socket.request.session;
  if (!session || !session?.authenticated) {
    return next(new Error("Unauthorized"));
  }

  // Set auth user onto session object
  const user: UserDocument = await container
    .resolve("userService")
    .findById(session.uid);
  socket.request.session.user = user;

  next();
});

io.on("connection", async function (socket: Socket) {
  const party: PartyDocument = await container
    .resolve("partyService")
    .findByUsername(socket.request.session?.user?.username);

  if (party) {
    socket.join(party.id);
  }

  socket.on(
    SocketEvent.CREATE_PARTY,
    async (data: CreatePartyDto, callback) => {
      await container
        .resolve("partyChannel")
        .createParty(socket, data, callback);
    }
  );

  socket.on(SocketEvent.LEAVE_PARTY, async (callback) => {
    await container.resolve("partyChannel").leaveParty(socket, callback);
  });

  socket.on(SocketEvent.JOIN_PARTY, async (data: JoinPartyDto, callback) => {
    await container.resolve("partyChannel").joinParty(socket, data, callback);
  });

  socket.on("error", (error) => {
    if (error && error.message === "Unauthorized") {
      socket.disconnect();
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnecting...");
  });
});
