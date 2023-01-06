import { SortOrder } from "mongoose";

export type GetMessagesDto = {
  partyId: string;
  sortBy: SortOrder;
};
