import Message, { MessageDocument } from "../../Model/Message";
import { CreateMessageDto, GetMessagesDto } from "./dto";

export interface ChatServiceContract {
  createMessage(dto: CreateMessageDto): Promise<MessageDocument>;
  getMessages(dto: GetMessagesDto): Promise<MessageDocument[]>;
  clearMessages(partyId: string): Promise<void>;
}

export class ChatService implements ChatServiceContract {
  public async createMessage(dto: CreateMessageDto): Promise<MessageDocument> {
    return await Message.create(dto);
  }

  public async getMessages(dto: GetMessagesDto): Promise<MessageDocument[]> {
    return await Message.find({ partyId: dto.partyId }, {}).sort({
      createdAt: dto.sortBy,
    });
  }

  public async clearMessages(partyId: string): Promise<void> {
    await Message.deleteMany({ partyId }).exec();
  }
}
