import { NextFunction, Request, Response } from "express";
import { UserServiceContract } from "../Service/UserService";
import { SessionServiceContract } from "../Service/SessionService";
import LoginValidator from "../Validator/Auth/LoginValidator";
import RegisterValidator from "../Validator/Auth/RegisterValidator";
import { PartyServiceContract } from "../Service/PartyService";

class AuthController {
  constructor(
    private readonly userService: UserServiceContract,
    private readonly partyService: PartyServiceContract,
    private readonly sessionService: SessionServiceContract
  ) {
    this.userService = userService;
    this.partyService = partyService;
    this.sessionService = sessionService;
  }

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const payload = await request.validate(RegisterValidator);

    const doesUserExist = await this.userService.exists(payload);
    if (doesUserExist) {
      return response
        .status(400)
        .json({ email: "Username or email already exists" });
    }

    try {
      const createdUser = await this.userService.registerUser(payload);

      await this.sessionService.regenSession(request.session);
      request.session.uid = createdUser.id;
      request.session.authenticated = true;
      await this.sessionService.saveSession(request.session);

      return response.status(201).json(createdUser.serialize());
    } catch (error) {
      next(error);
      return response.status(500).json({
        message:
          "We cannot process your request right now, please try again later.",
      });
    }
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
      await this.sessionService.regenSession(request.session);
      request.session.uid = user.id;
      request.session.authenticated = true;
      await this.sessionService.saveSession(request.session);
    } catch (error) {
      next(error);
      return response.status(500).json({
        message:
          "We cannot process your request right now, please try again later.",
      });
    }

    const party = await this.partyService.findByUsername(user!.username);

    return response.status(200).json({
      user: user.serialize(),
      party: party?.serialize(),
    });
  };

  session = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (!request.session || !request.session?.uid) {
      return response.status(401).json({ messsage: "Unauthorized" });
    }

    try {
      const user = await this.userService.findById(request.session.uid);
      const party = await this.partyService.findByUsername(user!.username);

      return response.status(200).json({
        user: user?.serialize(),
        party: party?.serialize(),
      });
    } catch (err) {
      next(err);
      return response.status(500);
    }
  };
}

export default AuthController;
