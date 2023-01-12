import User, { UserDocument } from "../../Model/User";
import { RegisterUserDto, UserExistsDto } from "./dto";

export interface UserServiceContract {
  exists(dto: UserExistsDto): Promise<boolean>;
  registerUser(dto: RegisterUserDto): Promise<any>;
  findByUsername(username: string): Promise<UserDocument | null>;
  findById(uid: string): Promise<UserDocument | null>;
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

  public async findById(uid: string): Promise<UserDocument | null> {
    const user = await User.findById(uid).exec();
    return user;
  }

  public async registerUser(dto: RegisterUserDto): Promise<any> {
    const createdUser = await User.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    return createdUser;
  }
}

export default UserService;
