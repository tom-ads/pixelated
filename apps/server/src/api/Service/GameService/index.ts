import { getRandomWord } from "../../../helpers/game";
import { PartyDocument } from "../../Model/Party";
import { PartyServiceContract } from "../PartyService";
import { setDrawer } from "../../../helpers/game";

export interface GameServiceContract {
  setupTurn(partyId: string): Promise<PartyDocument | null>;
}

class GameService implements GameServiceContract {
  constructor(private readonly partyService: PartyServiceContract) {}

  public async setupTurn(partyId: string): Promise<PartyDocument | null> {
    let party = await this.partyService.findById(partyId);
    if (party) {
      const turnWord = getRandomWord();
      const members = setDrawer(party);
      party = await this.partyService.updateParty({
        partyId,
        query: { turnWord, members },
      });
    }

    return party;
  }
}

export default GameService;
