import { Socket } from "socket.io";
import { socketResponse } from "../../../helpers";
import SocketEvent from "../../Enum/SocketEvent";
import SocketStatus from "../../Enum/SocketStatus";
import Party, { PartyDocument, PartySchema } from "../../Model/Party";
import { UserServiceContract } from "../UserService";
import { CreatePartyDto, LeavePartyDto } from "./dto";

export interface PartyServiceContract {
  createParty(socket: Socket, dto: CreatePartyDto): Promise<PartyDocument>;
  leaveParty(socket: Socket, dto: LeavePartyDto): Promise<void>;
  findByUsername(username: string): Promise<PartyDocument | null>;
}

export class PartyService implements PartyServiceContract {
  constructor(private userService: UserServiceContract) {
    this.userService = userService;
  }

  private async deleteParty(id: string): Promise<void> {
    await Party.findByIdAndDelete(id);
  }

  public async findByUsername(username: string): Promise<PartyDocument | null> {
    const party = await Party.findOne({ "members.username": username }).exec();
    return party;
  }

  public async leaveParty(socket: Socket): Promise<void> {
    const session = socket.request.session;

    const user = await this.userService.findById(session?.uid);
    if (!user) {
      throw new Error("Unable to find user");
    }

    const existingParty = await this.findByUsername(user.username);
    if (!existingParty) {
      throw new Error("Party does not exist");
    }

    if (existingParty.members?.length === 1) {
      await existingParty.delete();
      socket.to(existingParty.id).disconnectSockets();
      return;
    }

    // Remove user from party
    await existingParty.updateOne({
      $pull: { members: { username: user.username } },
    });

    // TODO: transfer ownership to another party member

    // Broadcast to party members that user has left
    socket.broadcast.to(existingParty.id).emit(
      SocketEvent.USER_LEFT,
      socketResponse(SocketStatus.SUCCESS, {
        data: {
          party: existingParty,
        },
      })
    );
  }

  public async createParty(
    socket: Socket,
    dto: CreatePartyDto
  ): Promise<PartyDocument> {
    // Find owner
    const owner = await this.userService.findById(socket.request.session.uid);
    if (!owner) {
      throw new Error("Unable to find session user");
    }

    // Removing any existing party of user
    const existingParty = await this.findByUsername(owner?.username);
    if (existingParty) {
      await this.deleteParty(existingParty.id);
      console.log(
        `[Party] Ended party ${existingParty.name}(${existingParty.id})`
      );
    }

    // Create new party
    const createdParty = await Party.create({
      name: dto.name,
      code: "123",
      members: [
        {
          username: owner.username,
          isOwner: true,
        },
      ],
    });

    console.log(
      `[Party] Created party ${createdParty.name}(${createdParty.id})`
    );

    socket.join(createdParty.id);

    return createdParty;
  }
}

export default PartyService;
