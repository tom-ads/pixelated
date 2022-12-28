import { Request, Response } from "express";
import { UserServiceContract } from "../Service/UserService";
import RegisterValidator from "../Validator/Auth/RegisterValidator";

class AuthController {
  constructor(private readonly userService: UserServiceContract) {
    this.userService = userService;
  }

  register = async (request: Request, response: Response) => {
    const payload = await request.validate(RegisterValidator);

    const doesUserExist = await this.userService.exists(payload);
    if (doesUserExist) {
      response
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const createdUser = await this.userService.registerUser(payload);

    return response.status(201).json({ message: "" });
  };
}

export default AuthController;
