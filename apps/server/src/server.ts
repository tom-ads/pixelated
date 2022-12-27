import express, { Express } from "express";
import cors from "cors";
import CorsConfig from "./config/Cors";
import * as dotenv from "dotenv";
import validationMiddleware from "./api/Middleware/ValidationMiddleware";
import { asClass, createContainer } from "awilix";
import AuthController from "./api/Controllers/AuthController";
import UserService from "./api/Services/UserService";

const app: Express = express();
app.use(cors(CorsConfig));
app.use(express.json());
app.use(validationMiddleware);

dotenv.config();

const container = createContainer({
  injectionMode: "CLASSIC",
});

// Register Controllers
container.register({
  authController: asClass(AuthController),
});

// Register Services
container.register({
  userService: asClass(UserService).scoped(),
});

app.post("/register", container.resolve("authController").register);

app.listen(process.env.APP_PORT, () => {
  console.log(`[API] Started on port ${process.env.APP_PORT}`);
});
