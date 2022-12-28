import { check } from "express-validator";

export default class RegisterValidator {
  public schema = {
    email: check("email").exists({ checkFalsy: true }).trim().isEmail().bail(),
    username: check("username")
      .exists({ checkFalsy: true, checkNull: true })
      .trim()
      .bail(),
    password: check("password")
      .exists({ checkFalsy: true })
      .isStrongPassword()
      .trim()
      .bail(),
    password_confirmation: check("password_confirmation")
      .exists({ checkFalsy: true })
      .isStrongPassword()
      .custom((value, { req }) => value === req.body.password)
      .trim()
      .bail(),
  };
}
