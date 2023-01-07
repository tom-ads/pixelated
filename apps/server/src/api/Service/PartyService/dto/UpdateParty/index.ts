import { IParty } from "../../../../Model/Party";

export type UpdatePartyDto = {
  partyId: string;
  query: Partial<IParty>;
};
