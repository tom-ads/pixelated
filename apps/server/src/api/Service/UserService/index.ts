import User, { UserDocument } from "../../Model/User";
import { RegisterUserDto, UserExistsDto, LoginUserDto } from "./dto";

export interface UserServiceContract {
  exists(dto: UserExistsDto): Promise<boolean>;
  registerUser(dto: RegisterUserDto): Promise<any>;
  loginUser(dto: LoginUserDto): Promise<UserDocument>;
  findByUsername(username: string): Promise<UserDocument | null>;
}

class UserService implements UserServiceContract {
  public async exists(dto: UserExistsDto): Promise<boolean> {
    const user = await User.exists({
      $or: [{ email: dto?.email }, { username: dto?.username }],
    });
    return !!user;
  }

  public async findByUsername(username: string): Promise<UserDocument | null> {
    const user = await User.findOne({ username }).exec();
    return user;
  }

  public async registerUser(dto: RegisterUserDto): Promise<any> {
    const createdUser = await User.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
  }

  public async loginUser(dto: LoginUserDto): Promise<any> {
    const user = User.find({ username: dto.username });

    // get user
    // prevent repeat session?
    // else create session
    // return user
  }
}

export default UserService;
