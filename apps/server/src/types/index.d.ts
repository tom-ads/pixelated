import { Schema, ValidationChain } from "express-validator";

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
      validate<T extends ValidationSchema, R extends ValidationParsed<T>>(
        validator: ValidatorFn<T>
      ): ValidatorReturn<R>;
    }
  }
}
