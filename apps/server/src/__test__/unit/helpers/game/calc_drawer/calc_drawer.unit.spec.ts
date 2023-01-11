import { calcDrawerScore } from "../../../../../helpers";

describe("Helper: Calc Drawer Score", () => {
  it("returns drawers score based on the number of correct guesses in their turn", () => {
    expect(calcDrawerScore(1, 0)).toEqual(25);
    expect(calcDrawerScore(2, 0)).toEqual(50);
    expect(calcDrawerScore(3, 0)).toEqual(75);
    expect(calcDrawerScore(4, 0)).toEqual(100);
    expect(calcDrawerScore(5, 0)).toEqual(125);
    expect(calcDrawerScore(6, 0)).toEqual(150);
  });

  it("returns drawers current score with the current turns score", () => {
    expect(calcDrawerScore(1, 200)).toEqual(225);
  });
});
