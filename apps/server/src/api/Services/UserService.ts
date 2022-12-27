export interface UserServiceContract {
  registerUser(): Promise<any>;
}

class UserService implements UserServiceContract {
  public async registerUser(): Promise<any> {
    return { name: "win" };
  }
}

export default UserService;
