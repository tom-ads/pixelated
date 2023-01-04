import { Socket } from "socket.io";
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
    console.log("existing party", existingParty);
    if (existingParty) {
      // Pull user out of party
      existingParty.update({}, { $pull: { username: user.username } });
    }

    console.log("updated party", existingParty);
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

    return createdParty;
  }

  public async getParty(socket: Socket): Promise<PartyDocument> {
    // Find user
    const user = await this.userService.findById(socket.request.session.uid);
    if (!user) {
      throw new Error("Unable to find session user");
    }

    // Find party
    const party = await this.findByUsername(user.username);
    if (!party) {
      throw new Error("Unable to find party");
    }

    console.log(`[Party] Retrevied party ${party.name}:${party.id}`);

    return party;
  }
}

export default PartyService;
