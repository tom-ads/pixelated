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
import PartyService from "./api/Service/PartyService";
import { CreatePartyDto } from "./api/Service/PartyService/dto";
import SocketEvent from "./api/Enum/SocketEvent";
import JoinPartyDto from "./api/Service/PartyService/dto/JoinParty";
import { UserDocument } from "./api/Model/User";
import { PartyChannel } from "./api/Channels/PartyChannel";
import { SendMessageDto } from "./api/Service/ChatService/dto";
import { ChatChannel } from "./api/Channels/ChatChannel";
import { ChatService } from "./api/Service/ChatService";
import { GameDrawingDto, StartGameDto } from "./api/Service/GameService/dto";
import GameService from "./api/Service/GameService";
import { GameChannel } from "./api/Channels/GameChannel";

// Create server
export const app: Express = express();
const server = http.createServer(app);
export const io = new Server(server, {
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
  chatService: asClass(ChatService).scoped(),
  gameService: asClass(GameService).scoped(),

  // Configs
  connectionString: asValue(process.env.MONGO_CONNECTION_URL),

  // Database
  db: asClass(MongoManager).classic(),

  // Channels
  partyChannel: asClass(PartyChannel).scoped(),
  chatChannel: asClass(ChatChannel).scoped(),
  gameChannel: asClass(GameChannel).scoped(),

  io: asValue(io),
});

(async function () {
  await container.resolve("db").createConnection();
})();

import { sessionConfig } from "./config/session";
import { socketResponse } from "./helpers";
import SocketStatus from "./api/Enum/SocketStatus";
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
  await container.resolve("partyChannel").partyReconnect(socket);

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

  socket.on(
    SocketEvent.SEND_MESSAGE,
    async (data: SendMessageDto, callback) => {
      await container
        .resolve("chatChannel")
        .sendMessage(socket, data, callback);
    }
  );

  socket.on(SocketEvent.START_GAME, async (data: StartGameDto, callback) => {
    await container.resolve("gameChannel").startGame(socket, data, callback);
  });

  socket.on(
    SocketEvent.GAME_DRAWING,
    async (data: GameDrawingDto, callback) => {
      await container.resolve("gameChannel").sendDrawing(socket, data);
      // callback(socketResponse(SocketStatus.SUCCESS, { data: undefined }));
    }
  );

  socket.on("error", (error) => {
    if (error && error.message === "Unauthorized") {
      socket.disconnect();
    }
  });

  socket.on("disconnect", () => {
    // Check if socket was part of an active game, if so, remove them from party.
    // Check if there is only one person left in that game.
    // end game, move back to party for other sockets.
    console.log("disconnecting...");
  });
});
