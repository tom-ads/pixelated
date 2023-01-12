import { IParty } from "../../../api/Model/Party";
import { faker } from "@faker-js/faker";
import Party from "../../../api/Model/Party";
import { PartyDocument } from "../../../api/Model/Party";

export async function createPartyFactory(
  override?: Partial<IParty>
): Promise<PartyDocument> {
  return await Party.create(
    Object.assign(
      {
        name: faker.animal.type(),
        code: faker.random.numeric(9),
        isPlaying: false,
        turnWord: null,
        correctGuesses: 0,
        round: 1,
        members: [],
      },
      override
    )
  );
}
