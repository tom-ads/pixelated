import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

userSchema.methods = {
  async checkPassword(password: string) {
    try {
      await bcrypt.compare(password, this.password);
    } catch (err) {
      console.log(`Failed to hash password`);
    }
  },
};

const User = model("user", userSchema);

export default User;
