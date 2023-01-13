import { CallbackError, Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  username: string;
  email: string;
  password: string;
  updatedAt: string;
  createdAt: string;
}

export interface SerializedUser extends Omit<IUser, "password" | "updatedAt"> {}

interface UserInstanceMethods {
  checkPassword(password: string): Promise<boolean>;
  serialize(): SerializedUser;
}

export interface UserDocument extends Document, IUser, UserInstanceMethods {}

export interface UserModel extends Model<IUser, {}, UserInstanceMethods> {
  hashPassword(password: string): Promise<string>;
}

export const UserSchema = new Schema<IUser, UserModel, UserInstanceMethods>(
  {
    username: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const isTesting = process.env.NODE_ENV === "test";
  if (isTesting) {
    this.password = this.password;
    return;
  }

  // Only hash password when password field has been modified
  if (this.isModified("password")) {
    try {
      this.password = await User.hashPassword(this.password);
      return next();
    } catch (err) {
      return next(err as CallbackError);
    }
  }
});

UserSchema.methods = {
  async checkPassword(password: string) {
    const isTesting = process.env.NODE_ENV === "test";
    if (isTesting) {
      return password === this.password;
    }

    return await bcrypt.compare(password, this.password);
  },
  serialize() {
    return {
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
    };
  },
};

UserSchema.statics = {
  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  },
};

const User = model<IUser, UserModel>("User", UserSchema);
export default User;
