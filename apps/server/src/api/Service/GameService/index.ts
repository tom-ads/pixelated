import {
  calcDrawerScore,
  calcGuesserScore,
  getRandomWord,
} from "../../../helpers/game";
import { PartyDocument, PartyMember } from "../../Model/Party";
import { PartyServiceContract } from "../PartyService";
import { setDrawer } from "../../../helpers/game";
import Party from "../../Model/Party";
import { ChatServiceContract } from "../ChatService";
import { Server } from "socket.io";
import SocketEvent from "../../Enum/SocketEvent";
import { socketResponse } from "../../../helpers";
import SocketStatus from "../../Enum/SocketStatus";
import { CheckGuessDto } from "./dto";
import { MessageType } from "../../Enum/MessageType";
import { IMessage } from "../../Model/Message";

export interface GameServiceContract {
  setupTurn(
    partyId: string
  ): Promise<{ party: PartyDocument | null; drawer: PartyMember | undefined }>;
  endTurn(partyId: string): Promise<PartyDocument | null>;
  setupRound(
    partyId: string,
    currentRound: number
  ): Promise<{ party: PartyDocument | null; drawer: PartyMember | undefined }>;
  checkGuess(dto: CheckGuessDto): Promise<boolean>;
  endGame(partyId: string): Promise<PartyDocument | null>;
}

class GameService implements GameServiceContract {
  constructor(
    private readonly io: Server,
    private readonly chatService: ChatServiceContract,
    private readonly partyService: PartyServiceContract
  ) {}

  public async setupTurn(
    partyId: string
  ): Promise<{ party: PartyDocument | null; drawer: PartyMember | undefined }> {
    let party = await this.partyService.findById(partyId);
    if (party) {
      const turnWord = getRandomWord();
      const members = setDrawer(party);
      party = await this.partyService.updateParty({
        partyId,
        query: { turnWord, members, isPlaying: true },
      });
    }

    return {
      party,
      drawer: party?.members.find((member) => member.isDrawer),
    };
  }

  public async setupRound(
    partyId: string,
    currentRound: number
  ): Promise<{ party: PartyDocument | null; drawer: PartyMember | undefined }> {
    // Send to party that round is over.
    this.io.in(partyId).emit(
      SocketEvent.RECEIVE_MESSAGE,
      socketResponse(SocketStatus.SUCCESS, {
        data: {
          partyId: partyId,
          sender: MessageType.SYSTEM_MESSAGE,
          message: `Round ${currentRound} over.`,
        } satisfies IMessage,
      })
    );

    // Setup next round
    const nextRound = currentRound + 1;
    await this.partyService.updateParty({
      partyId,
      query: { round: nextRound },
    });
    console.log(`[Game] Starting round ${nextRound} for party ${partyId}`);

    // Start next turn
    const updatedGame = await this.setupTurn(partyId);
    return updatedGame;
  }

  public async checkGuess(dto: CheckGuessDto): Promise<boolean> {
    const party = await this.partyService.findById(dto.partyId);

    // Check if there is an active game and a word for the current turn
    if (!party || !party?.isPlaying || !party.turnWord) {
      console.log("no party", party, party?.isPlaying, party?.turnWord);
      return false;
    }

    // check guess is correct word in turn
    if (party.turnWord.toLowerCase() !== dto.guess.toLowerCase()) {
      console.log(
        "no guess",
        party.turnWord.toLowerCase(),
        dto.guess.toLowerCase()
      );
      return false;
    }

    const guesser = party.members.find(
      (member) => member.username === dto.guesser
    );

    // prevent guesser from guessing again
    if (!guesser || guesser?.guessedPos || guesser?.isDrawer) {
      console.log(
        "no guesser",
        !guesser,
        guesser?.guessedPos,
        guesser?.isDrawer
      );
      return false;
    }

    // Track position the guesser guessed at to determine their score later
    const guessPos = party.correctGuesses + 1;
    await this.partyService.updateParty({
      partyId: dto.partyId,
      query: { correctGuesses: guessPos },
    });
    await this.partyService.updatePartyMember({
      partyId: dto.partyId,
      username: dto.guesser,
      query: { guessedPos: guessPos },
    });

    return true;
  }

  public async endTurn(partyId: string): Promise<PartyDocument | null> {
    let party = await this.partyService.findById(partyId);
    if (party) {
      // Calc turn scores.
      party.members.map((member) => {
        member.score = member.isDrawer
          ? calcDrawerScore(party!.correctGuesses, member.score)
          : calcGuesserScore(member.guessedPos, member.score);
        return member;
      });

      this.io.in(partyId).emit(
        SocketEvent.END_TURN,
        socketResponse(SocketStatus.SUCCESS, {
          data: party!.serialize(),
        })
      );
      this.io.in(partyId).emit(
        SocketEvent.GAME_DRAWING,
        socketResponse(SocketStatus.SUCCESS, {
          data: { act: "reset" },
        })
      );
      const drawer = party.members.find((member) => member.isDrawer);
      this.io.in(partyId).emit(
        SocketEvent.RECEIVE_MESSAGE,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            partyId: party.id,
            sender: MessageType.SYSTEM_MESSAGE,
            message: `${drawer?.username} turn has finished`,
          } satisfies IMessage,
        })
      );

      console.log(
        `[Game] Turn ended for ${drawer!.username} in round(${
          party?.round
        }) for party ${party.id}`
      );

      // Reset turn word and guesses in party
      party = await Party.findByIdAndUpdate(
        { _id: partyId },
        {
          $set: {
            turnWord: null,
            correctGuesses: 0,
            "members.$[].guessedPos": 0,
          },
        },
        { new: true }
      );
    }

    return party;
  }

  public async endGame(partyId: string): Promise<PartyDocument | null> {
    // Reset game state
    await this.chatService.clearMessages(partyId);
    const endGame = await Party.findByIdAndUpdate(
      { _id: partyId },
      {
        $set: {
          round: 1,
          correctGuesses: 0,
          turnWord: null,
          isPlaying: false,
          "members.$[].isDrawer": false,
          "members.$[].guessedPos": 0,
          "members.$[].rounds": 0,
          "members.$[].score": 0,
        },
      },
      { new: true }
    );

    console.log(`[Game] Ended game for party ${partyId}`);
    this.io.in(partyId).emit(
      SocketEvent.END_GAME,
      socketResponse(SocketStatus.SUCCESS, {
        data: endGame?.serialize(),
      })
    );

    return endGame;
  }
}

export default GameService;
