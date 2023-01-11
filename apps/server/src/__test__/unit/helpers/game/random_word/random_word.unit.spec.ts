import { getRandomWord } from "../../../../../helpers/game/random_word";

describe("Helper: Random Word", () => {
  it("returns a random word from a set", () => {
    expect(getRandomWord(["bunny"])).toEqual("bunny");
  });
});
