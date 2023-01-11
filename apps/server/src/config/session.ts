import { SessionOptions } from "express-session";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

export interface SessionConfig extends SessionOptions {}

export const SessionConfig: SessionConfig = {
  /* 
    Generate a unique session Id.
    default: Uses uuidv4 to generate unqiue session Id.
  */
  genid: () => uuidv4(),
  /* 
    Secret that is used to sign the session cookie.
    default: Uses APP_KEY environment variable to sign the cookie
  */
  secret: process.env.APP_KEY || "",
  /* 
    Setup the attributes that the generated cookie will use
  */
  cookie: {
    maxAge: 1000 * 60 * 60 * 48,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },

  saveUninitialized: false,

  resave: false,
};
