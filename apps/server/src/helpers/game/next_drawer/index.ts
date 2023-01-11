import { PartyMember } from "../../../api/Model/Party";

export function hasNextDrawer(
  members: PartyMember[],
  currentRound: number
): boolean {
  return members.some((member) => member.rounds !== currentRound);
}
