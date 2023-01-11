export interface GameConfigContract {
  turnDurationSeconds: number;
}

const envTurnDurationSeconds = process.env.TURN_DURATION_SECONDS;

export const GameConfig: GameConfigContract = {
  turnDurationSeconds: envTurnDurationSeconds
    ? parseInt(envTurnDurationSeconds, 10)
    : 90,
};
