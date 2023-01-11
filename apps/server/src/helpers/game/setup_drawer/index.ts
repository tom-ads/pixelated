import { PartyMember } from "../../../api/Model/Party";

export function setupDrawer(
  members: PartyMember[],
  round: number
): PartyMember[] {
  let drawerFound = false;
  members = members.map((member) => {
    if (member.isDrawer) {
      member.isDrawer = false;
    } else if (member.rounds < round && !drawerFound) {
      member.isDrawer = true;
      member.rounds += 1;
      drawerFound = true;
    }

    return member;
  });

  return members;
}
