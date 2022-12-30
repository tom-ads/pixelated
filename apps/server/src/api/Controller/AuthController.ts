import { NextFunction, Request, Response } from "express";
import { UserServiceContract } from "../Service/UserService";
import { SessionServiceContract } from "../Service/SessionService";
import LoginValidator from "../Validator/Auth/LoginValidator";
import RegisterValidator from "../Validator/Auth/RegisterValidator";

class AuthController {
  constructor(
    private readonly userService: UserServiceContract,
    private readonly sessionService: SessionServiceContract
  ) {
    this.userService = userService;
  }

  register = async (request: Request, response: Response) => {
    const payload = await request.validate(RegisterValidator);

    const doesUserExist = await this.userService.exists(payload);
    if (doesUserExist) {
      return response
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const createdUser = await this.userService.registerUser(payload);

    return response.status(201).json({ message: "message" });
  };

  login = async (request: Request, response: Response, next: NextFunction) => {
    const payload = await request.validate(LoginValidator);

    const user = await this.userService.findByUsername(payload.username);
    if (!user || !(await user.checkPassword(payload.password))) {
      return response.status(400).json({
        message: "Username or password incorrect, please check your details",
      });
    }

    try {
      await this.sessionService.startSession({
        uid: user.id,
        session: request.session,
      });
    } catch (err) {
      next(err);
      return response.status(500).json({
        message:
          "We cannot process your request right now, please try again later.",
      });
    }

    return response.status(200).json({ message: "valid user" });
  };
}

export default AuthController;
