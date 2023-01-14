// dont pull env when in production, as the host needs to handle this
import dotenv from "dotenv";
dotenv.config();

import express, { Express, NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";

import session from "express-session";
import SocketEvent from "./api/Enum/SocketEvent";
import { CreatePartyDto } from "./api/Service/PartyService/dto";
import JoinPartyDto from "./api/Service/PartyService/dto/JoinParty";
import { SendMessageDto } from "./api/Service/ChatService/dto";
import http from "http";
import { GameDrawingDto, StartGameDto } from "./api/Service/GameService/dto";
import { asClass, asValue, createContainer } from "awilix";
import AuthController from "./api/Controller/AuthController";
import UserService from "./api/Service/UserService";
import SessionService from "./api/Service/SessionService";
import PartyService from "./api/Service/PartyService";
import { ChatService } from "./api/Service/ChatService";
import GameService from "./api/Service/GameService";
import MongoManager from "./database/manager";
import { PartyChannel } from "./api/Channels/PartyChannel";
import { ChatChannel } from "./api/Channels/ChatChannel";
import { GameChannel } from "./api/Channels/GameChannel";
import { UserDocument } from "./api/Model/User";

// Create server
export const app: Express = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST,
    credentials: true,
  },
});

if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT || 80, () =>
    console.log(`[API] Listening on port ${process.env.APP_PORT}`)
  );

  server.on("error", (err) => {
    console.log(`[API] Error occured: ${err}`);
  });
}

// Configure express
app.enable("trust proxy");
app.set("trust-proxy", true);
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_HOST,
  })
);

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

import { SessionConfig } from "./config/session";
const sessionMiddleware = session(SessionConfig);
app.use(sessionMiddleware);

app.post("/auth/register", container.resolve("authController").register);
app.post("/auth/login", container.resolve("authController").login);
app.get("/auth/session", container.resolve("authController").session);

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
    socket.disconnect(true);
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

  socket.on(SocketEvent.GAME_DRAWING, async (data: GameDrawingDto) => {
    await container.resolve("gameChannel").sendDrawing(socket, data);
  });

  socket.on("error", (error) => {
    if (error && error.message === "Unauthorized") {
      socket.disconnect();
    }
  });

  socket.on("disconnect", async () => {
    console.log(socket.request.session.user.username + " disconnected");
    /*
      In the future, we could check if the user was in an
      active game and remove them from it. We'd need to end the game
      early if they were the last player or has left someone as the last
      player.
    */
  });
});
