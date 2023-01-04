import { Document, model, Model, Schema } from "mongoose";

export interface PartyMember {
  username: string;
  score: number;
  isOwner: boolean;
}

export interface IParty {
  name: string;
  code: string;
  members: PartyMember[];
}

export interface SerializedParty extends IParty {}

export interface PartyInstanceMethods {
  serialize(): SerializedParty;
}

export interface PartyDocument extends Document, IParty, PartyInstanceMethods {}

export interface PartyModel extends Model<IParty, {}, PartyInstanceMethods> {
  // statics
}

export const PartySchema = new Schema<IParty, PartyModel, PartyInstanceMethods>(
  {
    name: String,
    code: String,
    members: Array,
  },
  {
    timestamps: true,
  }
);

PartySchema.methods = {
  serialize() {
    return {
      name: this.name,
      code: this.code,
      members: this.members,
    };
  },
};

const Party = model<IParty, PartyModel>("Party", PartySchema);
export default Party;
