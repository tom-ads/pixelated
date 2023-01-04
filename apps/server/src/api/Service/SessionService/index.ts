import { Session } from "express-session";
import { nextTick } from "process";
import { StartSessionDto } from "./dto";

export interface SessionServiceContract {
  regenSession(session: Session): Promise<void>;
  saveSession(session: Session): Promise<void>;
}

class SessionService implements SessionServiceContract {
  public async regenSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) => {
      session.regenerate((error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }

  public async saveSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) => {
      session.save((error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }
}

export default SessionService;
