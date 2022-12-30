import { Session, SessionData } from "express-session";

export interface StartSessionDto {
  session: Session & Partial<SessionData>;
  uid: string;
}
