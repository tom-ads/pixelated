import Party, { PartyDocument } from "../../Model/Party";
import { AddPartyMemberDto, CreatePartyDto, RemovePartyMemberDto } from "./dto";

export interface PartyServiceContract {
  findByUsername(username: string): Promise<PartyDocument | null>;
  findByCode(code: string): Promise<PartyDocument | null>;
  createParty(dto: CreatePartyDto): Promise<PartyDocument>;
  addPartyMember(dto: AddPartyMemberDto): Promise<PartyDocument | null>;
  removePartyMember(dto: RemovePartyMemberDto): Promise<PartyDocument | null>;
}

export class PartyService implements PartyServiceContract {
  public async createParty(dto: CreatePartyDto): Promise<PartyDocument> {
    return await Party.create({
      name: dto.name,
      code: "123",
      members: [
        {
          username: dto.ownerUsername,
          isOwner: true,
        },
      ],
    });
  }

  public async findByCode(code: string): Promise<PartyDocument | null> {
    const party = await Party.findOne({ code }).exec();
    return party;
  }

  public async findByUsername(username: string): Promise<PartyDocument | null> {
    const party = await Party.findOne({ "members.username": username }).exec();
    return party;
  }

  public async addPartyMember(
    dto: AddPartyMemberDto
  ): Promise<PartyDocument | null> {
    const updatedDocument = await Party.findOneAndUpdate(
      { _id: dto.partyId },
      {
        $push: {
          members: {
            username: dto.username,
            isOwner: dto.isOwner,
          },
        },
      },
      { new: true }
    );

    return updatedDocument;
  }

  public async removePartyMember(
    dto: RemovePartyMemberDto
  ): Promise<PartyDocument | null> {
    const updatedDocument = await Party.findOneAndUpdate(
      { _id: dto.partyId },
      { $pull: { members: { username: dto.username } } },
      { new: true }
    );

    return updatedDocument;
  }
}

export default PartyService;
