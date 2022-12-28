import User from "../../Model/User";
import { RegisterUserDto } from "./dto/RegisterUser";
import UserExistsDto from "./dto/UserExists";

export interface UserServiceContract {
  exists(dto: UserExistsDto): Promise<boolean>;
  registerUser(dto: RegisterUserDto): Promise<any>;
}

class UserService implements UserServiceContract {
  public async exists(dto: UserExistsDto): Promise<boolean> {
    const user = await User.exists({
      $or: [{ email: dto?.email }, { username: dto?.username }],
    });
    return !!user;
  }

  public async registerUser(dto: RegisterUserDto): Promise<any> {
    const createdUser = await User.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
  }
}

export default UserService;
