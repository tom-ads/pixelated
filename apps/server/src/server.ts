// dont pull env when in production, as the host needs to handle this
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import validationMiddleware from "./api/Middleware/ValidationMiddleware";
import { asClass, asFunction, asValue, createContainer } from "awilix";
import AuthController from "./api/Controller/AuthController";
import UserService, { UserServiceContract } from "./api/Service/UserService";
import SessionService from "./api/Service/SessionService";
import MongoManager from "./database/manager";
import session from "express-session";
import CorsConfig from "./config/cors";
import http from "http";
import PartyService, { PartyServiceContract } from "./api/Service/PartyService";
import { PartyDocument } from "./api/Model/Party";
import { CreatePartyDto } from "./api/Service/PartyService/dto";

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

  // Web Sockets
  io: asFunction(() => {
    const io = new Server(server);
    return io;
  }),
});

(async function () {
  await container.resolve("db").createConnection();
})();

import { sessionConfig } from "./config/session";
import SocketEvent from "./api/Enum/SocketEvent";
import { socketResponse } from "./helpers";
import SocketStatus from "./api/Enum/SocketStatus";
import JoinPartyDto from "./api/Service/PartyService/dto/JoinParty";
import SocketError from "./api/Enum/SocketError";
import { UserDocument } from "./api/Model/User";
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
    next(new Error("Unauthorized"));
  }

  // Set auth user onto session object
  const user: UserDocument = await container
    .resolve("userService")
    .findById(session.uid);
  socket.request.session.user = user;

  next();
});

io.on("connection", function (socket: Socket) {
  socket.on(
    SocketEvent.CREATE_PARTY,
    async (data: CreatePartyDto, callback) => {
      const createdParty: PartyDocument = await container
        .resolve("partyService")
        .createParty(socket, data);

      callback(
        socketResponse(SocketStatus.SUCCESS, { data: createdParty.serialize() })
      );
    }
  );

  socket.on(SocketEvent.LEAVE_PARTY, async (callback) => {
    await container.resolve("partyService").leaveParty(socket);
    callback(
      socketResponse(SocketStatus.SUCCESS, {
        data: "success",
      })
    );
  });

  socket.on(SocketEvent.JOIN_PARTY, async (data: JoinPartyDto, callback) => {
    const session = socket.request.session;
    const partyService: PartyServiceContract = await container.resolve(
      "partyService"
    );

    // Check party exists
    const party = await partyService.findByCode(data.code);
    if (!party) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.INVALID_PARTY,
            message: "Party with that code does not exist",
          },
        })
      );
    }

    try {
      // Socket joins party and returns party
      await partyService.addPartyMember(party, session.user);
      socket.join(party.id);
      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: party.serialize(),
        })
      );

      // Broadcast to party members that a user joined
      socket.broadcast.to(party.id).emit(
        SocketEvent.USER_JOINED,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: party.serialize(),
            message: `${session.user.username} joined the party`,
          },
        })
      );
    } catch {
      callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.CANNOT_JOIN,
            message: "Unable to join party, please try again later.",
          },
        })
      );
    }
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
