import { PartyMemberFactory } from "../../../../../database/factories";
import { setupDrawer } from "../../../../../helpers";

describe("Helper: Setup Drawer", () => {
  it("returns a drawer from the list of party members", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 0 }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(setupDrawer(members, round)).toEqual(
      expect.arrayContaining([expect.objectContaining({ isDrawer: true })])
    );
  });

  it("returns no drawer as each member has taken their turn in round 1", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 1 }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(setupDrawer(members, round)).toEqual(
      expect.arrayContaining([expect.objectContaining({ isDrawer: false })])
    );
  });

  it("returns party members with no drawer, as previous drawer is unset and round is over", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 1, isDrawer: true }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(setupDrawer(members, round)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: "Bob Marley", isDrawer: false }),
      ])
    );
  });

  it("returns all members passed in", () => {
    const round = 1;
    const members = [
      PartyMemberFactory({ username: "Bob Marley", rounds: 1, isDrawer: true }),
      PartyMemberFactory({ username: "James Bond", rounds: 1 }),
    ];

    expect(setupDrawer(members, round)).toHaveLength(2);
  });
});
