export function calcDrawerScore(
  correctGuesses: number,
  prevScore: number
): number {
  const turnScore = correctGuesses * 25;
  return prevScore + turnScore;
}
