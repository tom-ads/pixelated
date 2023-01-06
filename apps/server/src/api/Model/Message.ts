import { Document, model, Model, Schema } from "mongoose";

export interface IMessage {
  partyId: string;
  sender: string;
  message: string;
}

export interface SerializedMessage extends Omit<IMessage, "partyId"> {
  id: string;
}

export interface MessageInstanceMethods {
  serialize(): SerializedMessage;
}

export interface MessageDocument
  extends Document,
    IMessage,
    MessageInstanceMethods {}

export interface MessageModel
  extends Model<IMessage, {}, MessageInstanceMethods> {
  // statics
}

export const MessageSchema = new Schema<
  IMessage,
  MessageModel,
  MessageInstanceMethods
>(
  {
    partyId: String,
    sender: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

MessageSchema.methods = {
  serialize() {
    return {
      id: this.id,
      sender: this.sender,
      message: this.message,
    };
  },
};

const Message = model<IMessage, MessageModel>("Message", MessageSchema);
export default Message;
