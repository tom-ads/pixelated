import {
  calcDrawerScore,
  calcGuesserScore,
  getRandomWord,
  obscureWord,
} from "../../../helpers/game";
import { PartyDocument, PartyMember } from "../../Model/Party";
import { PartyServiceContract } from "../PartyService";
import Party from "../../Model/Party";
import { ChatServiceContract } from "../ChatService";
import { Server } from "socket.io";
import SocketEvent from "../../Enum/SocketEvent";
import { socketResponse } from "../../../helpers";
import SocketStatus from "../../Enum/SocketStatus";
import { CheckGuessDto } from "./dto";
import { MessageType } from "../../Enum/MessageType";
import { SerializedMessage } from "../../Model/Message";
import { randomUUID } from "crypto";
import { words } from "../../../words";

export interface GameServiceContract {
  startTurn(
    partyId: string,
    members: PartyMember[]
  ): Promise<PartyDocument | null>;
  endTurn(partyId: string): Promise<PartyDocument | null>;
  setupRound(
    partyId: string,
    currentRound: number
  ): Promise<PartyDocument | null>;
  checkGuess(dto: CheckGuessDto): Promise<boolean>;
  endGame(partyId: string): Promise<PartyDocument | null>;
}

class GameService implements GameServiceContract {
  constructor(
    private readonly io: Server,
    private readonly chatService: ChatServiceContract,
    private readonly partyService: PartyServiceContract
  ) {}

  public async startTurn(
    partyId: string,
    members: PartyMember[]
  ): Promise<PartyDocument | null> {
    let game = await this.partyService.findById(partyId);
    if (game) {
      const drawer = members.find((member) => member.isDrawer)!;
      this.io.in(partyId).emit(
        SocketEvent.RECEIVE_MESSAGE,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            id: randomUUID(),
            sender: MessageType.SYSTEM_MESSAGE,
            message: `Turn starting. ${drawer?.username} is the drawer.`,
          } satisfies SerializedMessage,
        })
      );

      game.turnWord = getRandomWord(words);
      game = await this.partyService.updateParty({
        partyId,
        query: { turnWord: game.turnWord, members, isPlaying: true },
      });

      // Inform drawer that it is their turn w/ the word included in the party
      this.io.to(drawer!.socketId).emit(
        SocketEvent.START_TURN,
        socketResponse(SocketStatus.SUCCESS, {
          data: game!.serialize(),
        })
      );

      // Broadcast to guessers that the game has started
      this.io
        .to(partyId)
        .except(drawer!.socketId)
        .emit(
          SocketEvent.START_TURN,
          socketResponse(SocketStatus.SUCCESS, {
            data: {
              ...game!.serialize(),
              turnWord: obscureWord(game!.turnWord as string),
            },
          })
        );
      console.log(
        `[GAME] Next turn drawer ${drawer.username} for party ${partyId}`
      );
    }

    return game;
  }

  public async endTurn(partyId: string): Promise<PartyDocument | null> {
    let party = await this.partyService.findById(partyId);
    if (party) {
      // Calc turn scores.
      party.members = party.members.map((member) => ({
        ...member,
        guessedPos: 0,
        score: member.isDrawer
          ? calcDrawerScore(party!.correctGuesses, member.score)
          : calcGuesserScore(member.guessedPos, member.score),
      }));

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
            id: randomUUID(),
            sender: MessageType.SYSTEM_MESSAGE,
            message: `${drawer?.username} turn has finished`,
          } satisfies SerializedMessage,
        })
      );

      console.log(
        `[Game] Turn ended for ${drawer!.username} in round(${
          party?.round
        }) for party ${party.id}`
      );

      party = await Party.findByIdAndUpdate(
        { _id: partyId },
        {
          $set: {
            turnWord: null,
            correctGuesses: 0,
            members: party.members,
          },
        },
        { new: true }
      );
    }

    return party;
  }

  public async setupRound(
    partyId: string,
    currentRound: number
  ): Promise<PartyDocument | null> {
    // Send to party that round is over.
    this.io.in(partyId).emit(
      SocketEvent.RECEIVE_MESSAGE,
      socketResponse(SocketStatus.SUCCESS, {
        data: {
          id: randomUUID(),
          sender: MessageType.SYSTEM_MESSAGE,
          message: `Round ${currentRound} over.`,
        } satisfies SerializedMessage,
      })
    );

    // Setup next round
    const nextRound = currentRound + 1;
    const updatedGame = await this.partyService.updateParty({
      partyId,
      query: { round: nextRound },
    });
    console.log(`[Game] Starting round ${nextRound} for party ${partyId}`);

    return updatedGame;
  }

  public async checkGuess(dto: CheckGuessDto): Promise<boolean> {
    const party = await this.partyService.findById(dto.partyId);

    // Check if there is an active game and a word for the current turn
    if (!party || !party?.isPlaying || !party.turnWord) {
      return false;
    }

    // check guess is correct word in turn
    if (party.turnWord.toLowerCase() !== dto.guess.toLowerCase()) {
      return false;
    }

    const guesser = party.members.find(
      (member) => member.username === dto.guesser
    );

    // prevent guesser from guessing again
    if (!guesser || guesser?.guessedPos || guesser?.isDrawer) {
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
