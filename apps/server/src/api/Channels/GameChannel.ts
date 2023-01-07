import { Server, Socket } from "socket.io";
import { socketResponse } from "../../helpers";
import { getRandomWord, setDrawer } from "../../helpers/game";
import SocketError from "../Enum/SocketError";
import SocketEvent from "../Enum/SocketEvent";
import SocketStatus from "../Enum/SocketStatus";
import { ChatServiceContract } from "../Service/ChatService";
import { GameServiceContract } from "../Service/GameService";
import { PartyServiceContract } from "../Service/PartyService";
import { StartGameDto } from "../Service/GameService/dto";
import {
  clearIntervalAsync,
  setIntervalAsync,
} from "set-interval-async/dynamic";
import { io } from "../../server";
import Message, { IMessage, SerializedMessage } from "../Model/Message";
import { MessageType } from "../Enum/MessageType";
import { randomUUID } from "crypto";

export class GameChannel {
  constructor(
    private readonly partyService: PartyServiceContract,
    private readonly chatService: ChatServiceContract,
    private readonly gameService: GameServiceContract // private readonly io: Server
  ) {}

  public async startGame(socket: Socket, data: StartGameDto, callback: any) {
    const party = await this.partyService.findById(data);
    if (!party) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.INVALID_PARTY,
            message: "Party does not exist",
          },
        })
      );
    }

    if (party.members.length < 2) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.MEMBER_MIN_LIMIT,
            message: "Party must have atleast 2 members to start game!",
          },
        })
      );
    }

    try {
      // Setup initial round & turn
      const turnWord = getRandomWord();
      const members = setDrawer(party);
      await this.partyService.updateParty({
        partyId: party.id,
        query: { isPlaying: true, turnWord, members },
      });

      // Clear party chat
      await this.chatService.clearMessages(party.id);

      // Send drawer the party w/ the word
      const drawer = members.find((member) => member.isDrawer)!;
      socket.to(drawer.socketId).emit(
        SocketEvent.START_GAME,
        socketResponse(SocketStatus.SUCCESS, {
          data: party.serialize(),
        })
      );

      // Broadcast to guessers that the game has started
      io.in(party.id)
        .except(drawer.socketId)
        .emit(
          SocketEvent.START_GAME,
          socketResponse(SocketStatus.SUCCESS, {
            data: {
              ...party.serialize(),
              turnWord: undefined, // prevent guessers from seeing word in payload
            },
          })
        );

      let startingCounter = 5;
      const gameStartingTimer = setIntervalAsync(async () => {
        console.log(`starting timer ${startingCounter}s`);

        io.in(party.id).emit(
          SocketEvent.RECEIVE_MESSAGE,
          socketResponse(SocketStatus.SUCCESS, {
            data: {
              id: randomUUID(),
              sender: MessageType.SYSTEM_MESSAGE,
              message: `Starting game in ${startingCounter}s`,
            } satisfies SerializedMessage,
          })
        );

        startingCounter--;
        if (startingCounter === 0) {
          clearIntervalAsync(gameStartingTimer);
        }
      }, 1000);

      // after START_GAME, send GAME_PAUSE timer = 5s.
      // After GAME_PAUSE, start countdown interval broadcasting to party members

      let turnCounter = 30;
      const turnTimer = setIntervalAsync(async () => {
        // Wait for game counter to finish
        if (turnCounter === 30) {
          await new Promise<void>((resolve) => setTimeout(resolve, 5000));
        }

        // Start turn timer

        io.in(party.id).emit(
          SocketEvent.GAME_DATA,
          socketResponse(SocketStatus.SUCCESS, {
            data: `Turn Timer ${turnCounter}s`,
          })
        );

        console.log(`turn timer ${turnCounter}`);
        turnCounter--;

        if (turnCounter === 0) {
          clearIntervalAsync(turnTimer);
        }
      }, 1000);

      // callback(socketResponse(SocketStatus.SUCCESS, { data: undefined }));
    } catch (error) {
      console.log(
        `[Game] Error occured while attempting to start a game, due to: ${error}`
      );
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.GAME_FAILED,
            message: "We're unable to start your game, please try again later.",
          },
        })
      );
    }
  }
}
