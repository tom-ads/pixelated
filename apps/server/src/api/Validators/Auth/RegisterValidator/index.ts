import { check } from "express-validator";

export default class RegisterValidator {
  public schema = [
    check("username")
      .exists({ checkFalsy: true, checkNull: true })
      .trim()
      .escape()
      .bail(),
    check("email").exists({ checkFalsy: true }).trim().isEmail().bail(),
    check("password")
      .exists({ checkFalsy: true })
      .isStrongPassword()
      .trim()
      .bail(),
    check("password_confirmation")
      .exists({ checkFalsy: true })
      .isStrongPassword()
      .custom((value, { req }) => value === req.body.password)
      .trim()
      .bail(),
  ];
}
