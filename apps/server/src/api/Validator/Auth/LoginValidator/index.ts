import { check } from "express-validator";

export default class LoginValidator {
  public schema = {
    username: check("username").exists({ checkFalsy: true }).trim().bail(),
    password: check("password")
      .exists({ checkFalsy: true })
      .isStrongPassword()
      .trim()
      .bail(),
  };
}
