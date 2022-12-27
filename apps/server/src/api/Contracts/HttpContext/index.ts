import { Request, Response } from "express";

type ValidatorContract = {
  handle: () => boolean;
};

export interface HttpContextContract {
  request: Request;
  response: Response;
}
