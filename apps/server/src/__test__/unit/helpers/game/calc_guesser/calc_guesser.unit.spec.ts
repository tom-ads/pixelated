import { calcGuesserScore, setupDrawer } from "../../../../../helpers";

describe("Helper: Calc Guesser Score", () => {
  it("returns updated party members score from first to sixth place", () => {
    expect(calcGuesserScore(1, 0)).toEqual(200);
    expect(calcGuesserScore(2, 0)).toEqual(175);
    expect(calcGuesserScore(3, 0)).toEqual(150);
    expect(calcGuesserScore(4, 0)).toEqual(125);
    expect(calcGuesserScore(5, 0)).toEqual(100);
    expect(calcGuesserScore(6, 0)).toEqual(75);
  });

  it("returns members current score with the current turns score", () => {
    expect(calcGuesserScore(1, 200)).toEqual(400);
  });

  it("returns members current score without additional score, as they didn't guess the word", () => {
    expect(calcGuesserScore(0, 200)).toEqual(200);
  });
});
