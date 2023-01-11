import { ServerOptions } from "socket.io";

const IoConfig: Partial<ServerOptions> = {
  cors: {
    origin: process.env.CLIENT_HOST,
    credentials: true,
  },
};

export default IoConfig;
