import { PartyMember } from "../../../api/Model/Party";
import { faker } from "@faker-js/faker";

export function createPartyMemberFactory(
  override?: Partial<PartyMember>
): PartyMember {
  return Object.assign(
    {
      username: faker.internet.userName(),
      score: 0,
      rounds: 1,
      guessedPos: 0,
      isDrawer: false,
      isOwner: false,
      socketId: faker.datatype.uuid(),
    },
    override
  );
}
