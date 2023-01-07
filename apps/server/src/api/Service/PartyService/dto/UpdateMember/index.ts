import { PartyMember } from "../../../../Model/Party";

export type UpdateMemberDto = {
  partyId: string;
  username: string;
  query: Partial<PartyMember>;
};
