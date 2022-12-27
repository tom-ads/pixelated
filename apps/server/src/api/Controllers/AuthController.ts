import { Request, Response } from "express";
import { UserServiceContract } from "../Services/UserService";

class AuthController {
  constructor(private readonly userService: UserServiceContract) {
    this.userService = userService;

    this.register = this.register.bind(this);
  }

  public register(request: Request, response: Response) {
    // const payload = await request.validate(RegisterValidator);
    console.log(this.userService);
    // const createdUser = await this.userService.createUser();

    return response.status(200).json({ message: "" });
  }
}

export default AuthController;
