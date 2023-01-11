export function calcGuesserScore(guessPos: number, prevScore: number): number {
  const turnScore = guessPos > 0 ? 225 - 25 * guessPos : 0;
  return prevScore + turnScore;
}
