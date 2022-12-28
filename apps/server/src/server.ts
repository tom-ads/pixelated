import express, { Express } from "express";
import cors from "cors";
import CorsConfig from "./config/cors";
import * as dotenv from "dotenv";
import validationMiddleware from "./api/Middleware/ValidationMiddleware";
import { asClass, asValue, createContainer } from "awilix";
import AuthController from "./api/Controller/AuthController";
import UserService from "./api/Service/UserService";
import MongoManager from "./database/manager";
import { DatabaseConfig } from "./config/database";

const app: Express = express();
app.use(cors(CorsConfig));
app.use(express.json());
app.use(validationMiddleware);

dotenv.config();

const container = createContainer({
  injectionMode: "CLASSIC",
});

container.register({
  // Controllers
  authController: asClass(AuthController),

  // Services
  userService: asClass(UserService).scoped(),

  // Configs
  connectionString: asValue(process.env.MONGO_CONNECTION_URL),

  // Database
  db: asClass(MongoManager).classic(),
});

(async function () {
  await container.resolve("db").createConnection();
})();

app.post("/register", container.resolve("authController").register);

app.listen(process.env.APP_PORT, () => {
  console.log(`[API] Started on port ${process.env.APP_PORT}`);
});
