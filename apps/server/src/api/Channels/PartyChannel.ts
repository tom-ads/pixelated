import { Socket } from "socket.io";
import { awaiter, socketResponse } from "../../helpers";
import SocketError from "../Enum/SocketError";
import SocketEvent from "../Enum/SocketEvent";
import SocketStatus from "../Enum/SocketStatus";
import { ChatServiceContract } from "../Service/ChatService";
import { PartyServiceContract } from "../Service/PartyService";
import { CreatePartyDto } from "../Service/PartyService/dto";
import JoinPartyDto from "../Service/PartyService/dto/JoinParty";
import { MessageType } from "../Enum/MessageType";

export class PartyChannel {
  constructor(
    private readonly chatService: ChatServiceContract,
    private readonly partyService: PartyServiceContract
  ) {}

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
        socketId: socket.id,
      });

      socket.join(createdParty.id);

      await awaiter(1000);

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

    // Limity party size to six
    if (party.members.length >= 6) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.MEMBER_MAX_LIMIT,
            message: "Party is full",
          },
        })
      );
    }

    // Party is in an active game
    if (party.isPlaying) {
      return callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.GAME_STARTED,
            message: "Party is currently in an active game",
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
        socketId: socket.id,
      });

      // Socket joins party
      socket.join(party.id);
      console.log(
        `[Party] ${session.user.username} has joined the party ${party.name}:${party.id}`
      );

      // Create system message
      const systemMessage = await this.chatService.createMessage({
        partyId: party.id,
        sender: MessageType.SYSTEM_MESSAGE,
        message: `${session.user.username} has joined the party!`,
      });

      // Get party messages
      const partyMessages = await this.chatService.getMessages({
        partyId: updatedParty?.id,
        sortBy: "asc",
      });

      // Send socket party and previous messages
      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: updatedParty?.serialize(),
            messages: partyMessages.map((message) => message.serialize()),
          },
        })
      );

      // Broadcast to other party members that someone joined
      socket.broadcast.to(party.id).emit(
        SocketEvent.USER_JOINED,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: updatedParty?.serialize(),
            message: systemMessage.serialize(),
          },
        })
      );
    } catch (error) {
      console.log(
        `[Party] Error occured while joining party, due to: ${error}`
      );
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
      await this.chatService.clearMessages(existingParty.id);
      socket.in(existingParty.id).disconnectSockets(true);
      console.log(
        `[Party] Party ${existingParty.name}:${existingParty.id} has ended`
      );
      return callback(socketResponse(SocketStatus.SUCCESS, {}));
    }

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

      // Create system message
      const systemMessage = await this.chatService.createMessage({
        partyId: existingParty.id,
        sender: MessageType.SYSTEM_MESSAGE,
        message: `${session.user.username} has left the party!`,
      });

      // Broadcast to party that the party member has left
      socket.broadcast.to(existingParty.id).emit(
        SocketEvent.USER_LEFT,
        socketResponse(SocketStatus.SUCCESS, {
          data: {
            party: updatedParty?.serialize(),
            message: systemMessage.serialize(),
          },
        })
      );

      console.log(
        `[Party] ${session.user.username} has left the party ${existingParty.name}:${existingParty.id}`
      );
    } catch (error) {}
  }

  public async partyReconnect(socket: Socket) {
    const session = socket.request.session;
    const party = await this.partyService.findByUsername(
      session?.user?.username
    );

    if (party) {
      socket.join(party.id);

      // Get party messages
      const previousMessages = await this.chatService.getMessages({
        partyId: party.id,
        sortBy: "asc",
      });

      // Set socketId to party member
      await this.partyService.updatePartyMember({
        partyId: party.id,
        username: session.user.username,
        query: { socketId: socket.id },
      });

      /* 
        We need to give the client time to initialise the getParty events
        before we can emit the USER_RECONNECTED event, else it won't be
        processed by the client in time.
      */
      setTimeout(() => {
        socket.emit(
          SocketEvent.USER_RECONNECTED,
          socketResponse(SocketStatus.SUCCESS, {
            data: {
              party: party.serialize(),
              messages: previousMessages?.map((message) => message.serialize()),
            },
          })
        );
      }, 200);
    }
  }
}
