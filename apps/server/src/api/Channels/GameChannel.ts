import { Socket } from "socket.io";
import { socketResponse } from "../../helpers";
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
import { TimerType } from "../Enum/TimerType";
import { obscureWord } from "../../helpers/game";
import { gameConfig } from "../../config/game";

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

    // if (party.members.length < 2) {
    //   return callback(
    //     socketResponse(SocketStatus.ERROR, {
    //       error: {
    //         type: SocketError.MEMBER_MIN_LIMIT,
    //         message: "Party must have atleast 2 members to start game!",
    //       },
    //     })
    //   );
    // }

    try {
      // Clear party chat
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
        let updatedParty = await this.gameService.setupTurn(party.id);
        if (!updatedParty.drawer) {
          // No drawer and game has hit its max round limit, end game
          if (updatedParty.party?.round === 3) {
            // TODO: add timer, so they can view the final scoreboard.
            await this.gameService.endGame(party.id);
            clearIntervalAsync(gameInterval);
            return;
          } else {
            // All members have drawn, start next round
            const nextRound = (updatedParty.party!.round += 1);
            updatedParty.party = await this.partyService.updateParty({
              partyId: party.id,
              query: { round: nextRound },
            });
            console.log(`[Game] Next round starting for party: ${party.id}`);

            updatedParty = await this.gameService.setupTurn(party.id);
          }
        }

        // Inform drawer that it is their turn w/ the word included in the party
        io.to(updatedParty.drawer!.socketId).emit(
          SocketEvent.START_TURN,
          socketResponse(SocketStatus.SUCCESS, {
            data: updatedParty.party!.serialize(),
          })
        );

        // Broadcast to guessers that the game has started
        io.to(party.id)
          .except(updatedParty.drawer!.socketId)
          .emit(
            SocketEvent.START_TURN,
            socketResponse(SocketStatus.SUCCESS, {
              data: {
                ...updatedParty.party!.serialize(),
                turnWord: obscureWord(updatedParty.party!.turnWord as string),
              },
            })
          );

        console.log(
          `[Game] Starting next turn with ${
            updatedParty.drawer!.username
          } as drawer in round ${updatedParty.party?.round} for party ${
            party.id
          }`
        );

        // Turn countdown timer
        let turnCounter = gameConfig.turnDurationSeconds;
        const turnTimer = setInterval(() => {
          io.in(party.id).emit(
            SocketEvent.GAME_TIMER,
            socketResponse(SocketStatus.SUCCESS, {
              data: {
                type: TimerType.TURN_TIMER,
                time: turnCounter,
              },
            })
          );

          console.log(
            `[Game] Party ${party.id} turn counter(${turnCounter}s) for drawer ${updatedParty.drawer?.username}`
          );

          turnCounter--;
          if (turnCounter < 0) {
            clearInterval(turnTimer);
          }
        }, 1000);

        // Pause interval until the turn is over
        await new Promise<void>((resolve) =>
          setTimeout(resolve, gameConfig.turnDurationSeconds * 1000)
        );

        updatedParty.party = await this.partyService.findById(party.id);
        io.in(party.id).emit(
          SocketEvent.END_TURN,
          socketResponse(SocketStatus.SUCCESS, {
            data: updatedParty.party!.serialize(),
          })
        );
        console.log(
          `[GAME] Turn ended for ${updatedParty.drawer!.username} in round(${
            updatedParty.party?.round
          }) for party ${party.id}`
        );

        // Internal timer before starting next game interval
        await new Promise<void>((resolve) => setTimeout(resolve, 10000));
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
}
