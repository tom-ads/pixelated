import { Session } from "express-session";

export interface SessionServiceContract {
  regenSession(session: Session): Promise<void>;
  saveSession(session: Session): Promise<void>;
}

class SessionService implements SessionServiceContract {
  public async regenSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) => {
      session.regenerate((error) => {
        if (error) {
          console.log(`[Api] Failed to regenerate session, due to: ${error}`);
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  public async saveSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) => {
      session.save((error) => {
        if (error) {
          console.log(`[Api] Failed to save session, due to: ${error}`);
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

export default SessionService;
