import { obscureWord } from "../../../../../helpers";

describe("Helper: Obscure Word", () => {
  it("returns passed in word obscured", () => {
    const word = "elephant";

    const expected = "--------";
    expect(obscureWord(word)).toEqual(expected);
  });

  it("returns passed in word obscured while maintaining spaces", () => {
    const word = "the elephant";

    const expected = "--- --------";
    expect(obscureWord(word)).toEqual(expected);
  });
});
