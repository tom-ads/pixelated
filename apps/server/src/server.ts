// dont pull env when in production, as the host needs to handle this
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response, Send } from "express";
import { Server as IoServer, Socket } from "socket.io";
import cors from "cors";
import validationMiddleware from "./api/Middleware/ValidationMiddleware";
import CorsConfig from "./config/cors";
import { UserDocument } from "./api/Model/User";
import PixeledApp from "./start/app";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import SocketEvent from "./api/Enum/SocketEvent";
import { CreatePartyDto } from "./api/Service/PartyService/dto";
import JoinPartyDto from "./api/Service/PartyService/dto/JoinParty";
import { SendMessageDto } from "./api/Service/ChatService/dto";
import { GameDrawingDto, StartGameDto } from "./api/Service/GameService/dto";

(async function () {
  try {
    await PixeledApp.startApplication();

    if (!PixeledApp.app) {
      throw new Error("Server not instantiated");
    }
    const app = PixeledApp.app;
    app.use(express.json());
    app.use(validationMiddleware);
    app.use(cors(CorsConfig));

    if (!PixeledApp.container) {
      throw new Error("Container not instantiated");
    }
    const container = PixeledApp.container;

    const sessionConfig = await container.resolve("sessionConfig");
    const sessionMiddleware = session({
      ...sessionConfig,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: process.env.MONGO_DB_NAME,
        collectionName: "sessions",
      }),
    });
    app.use(sessionMiddleware);

    app.post("/auth/register", container.resolve("authController").register);
    app.post("/auth/login", container.resolve("authController").login);
    app.get("/auth/session", container.resolve("authController").session);

    const io: IoServer = await container.resolve("io");
    if (!io) {
      throw new Error("Io Server not instantiated");
    }
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

      socket.on(
        SocketEvent.JOIN_PARTY,
        async (data: JoinPartyDto, callback) => {
          await container
            .resolve("partyChannel")
            .joinParty(socket, data, callback);
        }
      );

      socket.on(
        SocketEvent.SEND_MESSAGE,
        async (data: SendMessageDto, callback) => {
          await container
            .resolve("chatChannel")
            .sendMessage(socket, data, callback);
        }
      );

      socket.on(
        SocketEvent.START_GAME,
        async (data: StartGameDto, callback) => {
          await container
            .resolve("gameChannel")
            .startGame(socket, data, callback);
        }
      );

      socket.on(SocketEvent.GAME_DRAWING, async (data: GameDrawingDto) => {
        await container.resolve("gameChannel").sendDrawing(socket, data);
      });

      socket.on("error", (error) => {
        if (error && error.message === "Unauthorized") {
          socket.disconnect();
        }
      });

      socket.on("disconnect", async () => {
        /* 
          In the future, we could check if the user was in an 
          active game and remove them from it. We'd need to end the game
          early if they were the last player or has left someone as the last
          player.
        */
      });
    });
  } catch (err) {
    console.log(`[APP] Application failed to start, due to ${err}`);
  }
})();
