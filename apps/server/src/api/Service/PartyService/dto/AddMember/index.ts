export type AddPartyMemberDto = {
  partyId: string;
  username: string;
  isOwner: boolean;
  socketId?: string;
};
