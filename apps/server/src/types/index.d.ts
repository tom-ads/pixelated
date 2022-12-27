import { Schema, ValidationChain } from "express-validator";

export {};

interface IValidator<T extends ValidationChain[]> {
  schema: T;
}

export type Validator<T extends ValidationChain[] = ValidationChain[]> =
  new () => IValidator<T>;

declare global {
  namespace Express {
    export interface Request {
      validate<T extends ValidationChain[]>(
        validator: Validator<T>
      ): Promise<Record<string, any>>;
    }
  }
}
