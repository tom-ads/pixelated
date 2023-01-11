import { Socket } from "socket.io";
import { socketResponse } from "../../helpers";
import SocketError from "../Enum/SocketError";
import SocketEvent from "../Enum/SocketEvent";
import SocketStatus from "../Enum/SocketStatus";
import { ChatServiceContract } from "../Service/ChatService";
import { GameServiceContract } from "../Service/GameService";
import { PartyServiceContract } from "../Service/PartyService";
import { GameDrawingDto, StartGameDto } from "../Service/GameService/dto";
import {
  clearIntervalAsync,
  setIntervalAsync,
} from "set-interval-async/dynamic";
import { io } from "../../server";
import { TimerType } from "../Enum/TimerType";
import { hasNextDrawer, setupDrawer } from "../../helpers/game";
import { gameConfig } from "../../config/game";
import { awaiter } from "../../helpers/promise";

export class GameChannel {
  constructor(
    private readonly chatService: ChatServiceContract,
    private readonly gameService: GameServiceContract,
    private readonly partyService: PartyServiceContract
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
      // Send message in chat instead... but only to sender
      // return callback(
      //   socketResponse(SocketStatus.ERROR, {
      //     error: {
      //       type: SocketError.MEMBER_MIN_LIMIT,
      //       message: "Party must have atleast 2 members to start game!",
      //     },
      //   })
      // );
    }

    try {
      await this.chatService.clearMessages(party.id);

      // Inform party members the game is starting
      io.to(party.id).emit(
        SocketEvent.START_GAME,
        socketResponse(SocketStatus.SUCCESS, {
          data: undefined,
        })
      );

      // Start game interval
      const gameInterval = setIntervalAsync(async () => {
        let updatedGame = await this.partyService.findById(party.id);
        if (!updatedGame) return;

        if (!hasNextDrawer(updatedGame.members, updatedGame.round)) {
          if (updatedGame?.round === 3) {
            await this.gameService.endGame(party.id);
            clearIntervalAsync(gameInterval);
            return;
          } else {
            updatedGame = await this.gameService.setupRound(
              party.id,
              updatedGame.round
            );
          }
        }

        // Start next turn in round
        const members = setupDrawer(updatedGame!.members, updatedGame!.round);
        updatedGame = await this.gameService.startTurn(
          updatedGame?.id,
          members
        );

        // Turn countdown
        let turnCounter = gameConfig.turnDurationSeconds;
        const turnCountdown = setInterval(() => {
          io.in(party.id).emit(
            SocketEvent.GAME_TIMER,
            socketResponse(SocketStatus.SUCCESS, {
              data: { type: TimerType.TURN_TIMER, time: turnCounter },
            })
          );

          turnCounter--;
          if (turnCounter < 0) {
            clearInterval(turnCountdown);
          }
        }, 1000);
        await awaiter(gameConfig.turnDurationSeconds * 1000 + 2000);

        updatedGame = await this.gameService.endTurn(party.id);

        // Internal timer before starting next game interval
        await awaiter(10000);
      }, 1000);
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

  public async sendDrawing(socket: Socket, data: GameDrawingDto) {
    socket.broadcast.to(data.pId).emit(
      SocketEvent.GAME_DRAWING,
      socketResponse(SocketStatus.SUCCESS, {
        data,
      })
    );
  }
}
