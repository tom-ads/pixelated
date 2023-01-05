import { Socket } from "socket.io";
import { socketResponse } from "../../helpers";
import SocketError from "../Enum/SocketError";
import SocketEvent from "../Enum/SocketEvent";
import SocketStatus from "../Enum/SocketStatus";
import { PartyServiceContract } from "../Service/PartyService";
import { CreatePartyDto } from "../Service/PartyService/dto";
import JoinPartyDto from "../Service/PartyService/dto/JoinParty";

export class PartyChannel {
  constructor(private readonly partyService: PartyServiceContract) {}

  public async createParty(
    socket: Socket,
    data: CreatePartyDto,
    callback: any
  ) {
    const session = socket.request.session;

    try {
      const createdParty = await this.partyService.createParty({
        name: data.name,
        ownerUsername: session.user.username,
      });

      socket.join(createdParty.id);

      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: createdParty.serialize(),
        })
      );

      console.log(
        `[Party] Created party ${createdParty.name}:${createdParty.id}`
      );
    } catch (error) {
      console.log(`[Party] Failed to create party, due to: ${error}`);
      socketResponse(SocketStatus.ERROR, {
        error: {
          type: SocketError.INVALID_PARTY,
          message: "We're unable to create your party, please try again later.",
        },
      });
    }
  }

  public async joinParty(socket: Socket, data: JoinPartyDto, callback: any) {
    const session = socket.request.session;

    // Check party exists
    const party = await this.partyService.findByCode(data.code);
    if (!party) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.INVALID_PARTY,
            message: "Party with that code does not exist",
          },
        })
      );
    }

    // Prevent member from joining party again
    const memberExists = party.members.some(
      (member) => member.username === session.user.username
    );
    if (memberExists) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.MEMBER_EXISTS,
            message: "You've already joined this party",
          },
        })
      );
    }

    try {
      // Add party member to party document
      const updatedParty = await this.partyService.addPartyMember({
        partyId: party.id,
        username: session.user.username,
        isOwner: false,
      });

      // Socket joins party
      socket.join(party.id);
      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: updatedParty?.serialize(),
        })
      );

      // Broadcast to party members that a user joined
      socket.broadcast.to(party.id).emit(
        SocketEvent.USER_JOINED,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: updatedParty?.serialize(),
            message: `${session.user.username} joined the party`,
          },
        })
      );

      console.log(
        `[Party] ${session.user.username} has joined the party ${party.name}:${party.id}`
      );
    } catch (error) {
      console.log(`[Party] Failed to join party, due to: ${error}`);
      callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.CANNOT_JOIN,
            message: "Unable to join party, please try again later.",
          },
        })
      );
    }
  }

  public async leaveParty(socket: Socket, callback: any) {
    const session = socket.request.session;

    // Retrieve party
    const existingParty = await this.partyService.findByUsername(
      session.user.username
    );
    if (!existingParty) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.INVALID_PARTY,
            message: "Party does not exist",
          },
        })
      );
    }

    // End the party if last member of party
    if (existingParty.members?.length === 1) {
      await existingParty.delete();
      socket.in(existingParty.id).disconnectSockets(true);
      console.log(
        `[Party] Party ${existingParty.name}:${existingParty.id} has ended`
      );
      return callback(socketResponse(SocketStatus.SUCCESS, {}));
    }

    // Remove user from party
    try {
      // Remove party member from party document
      const updatedParty = await this.partyService.removePartyMember({
        partyId: existingParty.id,
        username: session.user.username,
      });

      // Leave party and inform socket of disconnection
      socket.leave(existingParty.id);
      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: "success",
        })
      );

      // Broadcast to party that the party member has left
      socket.broadcast.to(existingParty.id).emit(
        SocketEvent.USER_LEFT,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: updatedParty?.serialize(),
            message: `${session.user.username} has left the party`,
          },
        })
      );

      console.log(
        `[Party] ${session.user.username} has left the party ${existingParty.name}:${existingParty.id}`
      );
    } catch (error) {}
  }
}
