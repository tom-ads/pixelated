import { Socket } from "socket.io";
import { socketResponse } from "../../helpers";
import SocketError from "../Enum/SocketError";
import SocketEvent from "../Enum/SocketEvent";
import SocketStatus from "../Enum/SocketStatus";
import { ChatServiceContract } from "../Service/ChatService";
import { SendMessageDto } from "../Service/ChatService/dto";

export class ChatChannel {
  constructor(private readonly chatService: ChatServiceContract) {}

  public async sendMessage(socket: Socket, dto: SendMessageDto, callback: any) {
    const session = socket.request.session;

    try {
      // Store party message
      const createdMessage = await this.chatService.createMessage({
        ...dto,
        sender: session.user.username,
      });

      // Send message back to sender
      callback(
        socketResponse(SocketStatus.SUCCESS, {
          data: createdMessage.serialize(),
        })
      );

      // Broadcast message to party members
      socket.broadcast.to(dto.partyId).emit(
        SocketEvent.RECEIVE_MESSAGE,
        socketResponse(SocketStatus.SUCCESS, {
          data: createdMessage.serialize(),
        })
      );
    } catch (err) {
      console.log(`[Chat] Failed while sending party message, due to ${err}`);
      callback(
        socketResponse(SocketStatus.ERROR, {
          error: {
            type: SocketError.MESSAGE_FAILED,
            message: "Message failed to send",
          },
        })
      );
    }
  }
}
