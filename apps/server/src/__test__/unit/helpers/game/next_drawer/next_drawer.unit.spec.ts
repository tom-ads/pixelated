import { PartyMemberFactory } from "../../../../../database/factories";
import { hasNextDrawer } from "../../../../../helpers";

describe("Helper: Next Drawer", () => {
  it("returns true as there is a drawer available for the current round", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 0 }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(hasNextDrawer(members, round)).toEqual(true);
  });

  it("returns false as there isn't a drawer available for the current round", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 1 }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(hasNextDrawer(members, round)).toEqual(false);
  });
});
