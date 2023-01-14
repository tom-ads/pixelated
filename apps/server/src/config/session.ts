import { v4 as uuidv4 } from "uuid";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { SessionOptions } from "express-session";

export const SessionConfig: SessionOptions = {
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
    // Certain browsers will not set this in local environments
    sameSite: process.env.NODE_ENV === "production" ? "none" : false,
  },

  proxy: true,

  saveUninitialized: false,

  // @ts-ignore
  store: MongoStore.create({
    // @ts-ignore
    client: mongoose.connection.getClient(),
    dbName: process.env.MONGO_DB_NAME,
    collectionName: "sessions",
  }),

  resave: false,
};
