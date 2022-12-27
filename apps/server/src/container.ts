import { asClass, createContainer } from "awilix";
import AuthController from "./api/Controllers/AuthController";

async function startContainer() {
  const container = createContainer();

  // Resolve Controllers
  container.register({
    authController: asClass(AuthController).scoped(),
  });

  await container.loadModules(["./api/services/**/*.ts"], {
    formatName: "camelCase",
    esModules: true,
    resolverOptions: {
      // Scope each instance to the express request only
      lifetime: "SCOPED",
    },
  });

  return container;
}

export default startContainer;
