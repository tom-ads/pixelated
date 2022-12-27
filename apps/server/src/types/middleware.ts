import { NextFunction, Request, Response } from "express";

export interface MiddlewareParams {
  request: Request;
  response: Response;
  next: NextFunction;
}
