import { Session, SessionData } from "express-session";
import { Schema, ValidationChain } from "express-validator";
import { UserDocument } from "../api/Model/User";

export {};

type ValidationSchema = Record<string, ValidationChain>;

type ValidationParsed<T extends Record<string, any>> = T;

interface ValidationInstance<T extends ValidationSchema> {
  schema: T;
}

export type ValidatorFn<T extends ValidationSchema = ValidationSchema> =
  new () => ValidationInstance<T>;

export type ValidatorReturn<T extends ValidationParsed = ValidationParsed> =
  Promise<{ [K in keyof T]: any }>;

declare global {
  namespace Express {
    export interface Request {
      // Add validate fn to request object
      validate<T extends ValidationSchema, R extends ValidationParsed<T>>(
        validator: ValidatorFn<T>
      ): ValidatorReturn<R>;
    }
  }
}

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
