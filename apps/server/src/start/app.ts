import http, { Server } from "http";
import { Server as IoServer, ServerOptions } from "socket.io";
import express, { Express } from "express";
import { AwilixContainer } from "awilix";
import Container from "./container";
import ContainerConfig from "../config/container";
import IoConfig from "../config/io";

class PixelatedApp {
  public app?: Express;
  public httpServer?: Server;
  public container?: AwilixContainer;

  protected ioServer?: IoServer;

  public async startApplication() {
    this.startServer();
    this.startIoServer(IoConfig);
    await this.startContainer();
    await this.startDatabase();
  }

  public startServer() {
    try {
      const app: Express = express();
      this.app = app;

      const server = http.createServer(app);
      this.httpServer = server;

      server.listen(process.env.APP_PORT, () => {
        console.log(`[API] Started on port ${process.env.APP_PORT}`);
      });
    } catch (err) {
      console.log(`[APP] Failed to start app server due to: ${err}`);
    }
  }

  public startIoServer(config?: Partial<ServerOptions>) {
    try {
      if (!this.httpServer) {
        throw Error(
          "Failed to create Io Server. No http server instance found."
        );
      }

      this.ioServer = new IoServer(this.httpServer, config);
    } catch (err) {
      console.log(`[APP] Failed to start io server due to: ${err}`);
    }
  }

  public async startContainer() {
    const container = new Container();
    this.container = await container.startContainer(
      ContainerConfig,
      this.ioServer
    );
  }

  public async startDatabase() {
    try {
      if (!this.container) {
        throw new Error("Container instance not found");
      }

      await this.container.resolve("db").createConnection();
    } catch (err) {
      console.log(`[APP] DB Connection failed due to: ${err}`);
    }
  }
}

export default new PixelatedApp();
