import { randomInt } from "crypto";
import { clearIntervalAsync, setIntervalAsync } from "set-interval-async";
import { awaiter } from "../../../helpers";
import Party, { PartyDocument } from "../../Model/Party";
import {
  AddPartyMemberDto,
  CreatePartyDto,
  RemovePartyMemberDto,
  UpdateMemberDto,
  UpdatePartyDto,
} from "./dto";

export interface PartyServiceContract {
  findByUsername(username: string): Promise<PartyDocument | null>;
  findByCode(code: string): Promise<PartyDocument | null>;
  findById(id: string): Promise<PartyDocument | null>;
  createParty(dto: CreatePartyDto): Promise<PartyDocument>;
  addPartyMember(dto: AddPartyMemberDto): Promise<PartyDocument | null>;
  removePartyMember(dto: RemovePartyMemberDto): Promise<PartyDocument | null>;
  updateParty(dto: UpdatePartyDto): Promise<PartyDocument | null>;
  updatePartyMember(dto: UpdateMemberDto): Promise<PartyDocument | null>;
}

export class PartyService implements PartyServiceContract {
  public async generateCode(): Promise<number | null> {
    let validCode: number | null = null;
    try {
      let tries = 5;
      const codeInterval = setIntervalAsync(async () => {
        const code = randomInt(10000000, 99999999);
        const codeExists = await Party.findOne({ code }).exec();
        if (!codeExists?.id) {
          validCode = code;
        }

        tries--;
        if (tries === 0 || validCode) {
          clearIntervalAsync(codeInterval);
        }
      }, 1000);
    } catch {
      throw new Error("Invalid code");
    }

    await awaiter(5000);

    return validCode;
  }

  public async createParty(dto: CreatePartyDto): Promise<PartyDocument> {
    const code = randomInt(10000000, 99999999);

    return await Party.create({
      name: dto.name,
      code: code,
      isPlaying: false,
      correctGuesses: 0,
      round: 1,
      members: [
        {
          username: dto.ownerUsername,
          isOwner: true,
          isDrawer: false,
          guessedPos: 0,
          rounds: 0,
          score: 0,
          socketId: dto.socketId,
        },
      ],
    });
  }

  public async findById(partyId: string): Promise<PartyDocument | null> {
    const party = await Party.findById(partyId).exec();
    return party;
  }

  public async findByCode(code: string): Promise<PartyDocument | null> {
    const party = await Party.findOne({ code }).exec();
    return party;
  }

  public async findByUsername(username: string): Promise<PartyDocument | null> {
    const party = await Party.findOne({ "members.username": username }).exec();
    return party;
  }

  public async updateParty(dto: UpdatePartyDto): Promise<PartyDocument | null> {
    return await Party.findByIdAndUpdate(
      dto.partyId,
      { $set: dto.query },
      { new: true }
    );
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
            isDrawer: false,
            rounds: 0,
            score: 0,
            socketId: dto.socketId,
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

  public async updatePartyMember(
    dto: UpdateMemberDto
  ): Promise<PartyDocument | null> {
    const updatedDocument = await Party.findOneAndUpdate(
      { _id: dto.partyId, "members.username": dto.username },
      {
        $set: {
          "members.$.username": dto.query.username,
          "members.$.isOwner": dto.query.isOwner,
          "members.$.socketId": dto.query.socketId,
          "members.$.isDrawer": dto.query.isDrawer,
          "members.$.guessedPos": dto.query.guessedPos,
          "members.$.score": dto.query.score,
          "members.$.rounds": dto.query.rounds,
        },
      },
      { new: true }
    );

    return updatedDocument;
  }
}

export default PartyService;
