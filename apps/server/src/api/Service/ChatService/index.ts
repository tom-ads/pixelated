import Message, { MessageDocument } from "../../Model/Message";
import { CreateMessageDto } from "./dto";

export interface ChatServiceContract {
  createMessage(dto: CreateMessageDto): Promise<MessageDocument>;
}

export class ChatService implements ChatServiceContract {
  public async createMessage(dto: CreateMessageDto): Promise<MessageDocument> {
    return await Message.create(dto);
  }
}
