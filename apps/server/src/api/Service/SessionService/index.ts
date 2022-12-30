import { StartSessionDto } from "./dto";

export interface SessionServiceContract {
  startSession(dto: StartSessionDto): Promise<void>;
}

class SessionService implements SessionServiceContract {
  public async startSession(dto: StartSessionDto): Promise<void> {
    const { session, uid } = dto;

    session.regenerate(function (err) {
      if (err) throw new Error(err);

      // Set session data
      session.uid = uid;

      // Attempt to save sesssion
      session.save(function (err) {
        if (err) {
          throw new Error(err);
        }
      });
    });
  }
}

export default SessionService;
