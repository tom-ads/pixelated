import { Session } from "express-session";
import { UserDocument } from "../api/Model/User";

// Override global express-session "SessionData" type with custom data attributes
declare module "express-session" {
  interface SessionData {
    uid: string;
    authenticated: boolean;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      uid: string;
      user: UserDocument;
      authenticated: boolean;
    };
  }
}
