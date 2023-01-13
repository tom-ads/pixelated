import { IUser } from "../../../api/Model/User";
import { faker } from "@faker-js/faker";
import User from "../../../api/Model/User";
import { UserDocument } from "../../../api/Model/User";

export async function createUserFactory(
  override?: Partial<IUser>
): Promise<UserDocument> {
  return await User.create(
    Object.assign(
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "testPassword123!",
      },
      override
    )
  );
}
