import {
  asClass,
  asValue,
  createContainer,
  AwilixContainer,
  ContainerOptions,
} from "awilix";
import { Server as IoServer } from "socket.io";
import { ChatChannel } from "../api/Channels/ChatChannel";
import { GameChannel } from "../api/Channels/GameChannel";
import { PartyChannel } from "../api/Channels/PartyChannel";
import AuthController from "../api/Controller/AuthController";
import { ChatService } from "../api/Service/ChatService";
import GameService from "../api/Service/GameService";
import PartyService from "../api/Service/PartyService";
import SessionService from "../api/Service/SessionService";
import UserService from "../api/Service/UserService";
import { DatabaseConfig } from "../config/database";
import IoConfig from "../config/io";
import { SessionConfig } from "../config/session";
import DatabaseManager from "./database";

class Container {
  public container?: AwilixContainer;

  public async startContainer(config?: ContainerOptions, ioServer?: IoServer) {
    try {
      // Create container
      if (!this.container) {
        this.container = createContainer(config);
      }

      // Register dependencies
      await this.registerDatabase(this.container);
      await this.registerConfigs(this.container);
      await this.registerServices(this.container);
      await this.registerControllers(this.container);
      await this.registerChannels(this.container);
      if (ioServer) {
        await this.registerIo(this.container, ioServer);
      }

      return this.container;
    } catch (err) {
      console.log(
        `[CONTAINER] Failed to create container and register dependencies due to: ${err}`
      );
    }
  }

  public async registerControllers(container: AwilixContainer) {
    container.register({ authController: asClass(AuthController) });
  }

  public async registerServices(container: AwilixContainer) {
    container.register({
      userService: asClass(UserService).scoped(),
      sessionService: asClass(SessionService).scoped(),
      partyService: asClass(PartyService).scoped(),
      chatService: asClass(ChatService).scoped(),
      gameService: asClass(GameService).scoped(),
    });
  }

  public async registerConfigs(container: AwilixContainer) {
    container.register({
      connectionString: asValue(process.env.MONGO_CONNECTION_URL),

      ioConfig: asValue(IoConfig),
      dbConfig: asValue(DatabaseConfig),
      sessionConfig: asValue(SessionConfig),
    });
  }

  public async registerDatabase(container: AwilixContainer) {
    container.register({ db: asClass(DatabaseManager).classic() });
  }

  public async registerChannels(container: AwilixContainer) {
    container.register({
      partyChannel: asClass(PartyChannel).scoped(),
      chatChannel: asClass(ChatChannel).scoped(),
      gameChannel: asClass(GameChannel).scoped(),
    });
  }

  public async registerIo(container: AwilixContainer, io: IoServer) {
    container.register({
      io: asValue(io),
    });
  }
}

export default Container;
