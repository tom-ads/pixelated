import { StartSessionDto } from "./dto";

export interface SessionServiceContract {
  startSession(dto: StartSessionDto): Promise<void>;
}
