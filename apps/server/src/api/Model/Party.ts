import { Document, model, Model, Schema } from "mongoose";

export interface PartyMember {
  username: string;
  score: number;
  rounds: number;
  guessedPos: number;
  isDrawer: boolean;
  isOwner: boolean;
  socketId: string;
}

export interface IParty {
  name: string;
  code: string;
  correctGuesses: number;
  turnWord: string | null;
  round: number;
  isPlaying: boolean;
  members: PartyMember[];
}

export interface SerializedParty extends Omit<IParty, "members"> {
  id: string;
  members: Omit<PartyMember, "socketId">[];
}

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
    round: Number,
    correctGuesses: Number,
    turnWord: String,
    isPlaying: Boolean,
    members: Array,
  },
  {
    timestamps: true,
  }
);

PartySchema.methods = {
  serialize() {
    return {
      id: this.id,
      name: this.name,
      round: this.round,
      correctGuesses: this.correctGuesses,
      turnWord: this.turnWord,
      isPlaying: this.isPlaying,
      code: this.code,
      members:
        this.members?.map((member: PartyMember) => ({
          username: member.username,
          rounds: member.rounds,
          guessedPos: member.guessedPos,
          isDrawer: member.isDrawer,
          isOwner: member.isOwner,
          score: member.score,
        })) ?? [],
    };
  },
};

const Party = model<IParty, PartyModel>("Party", PartySchema);
export default Party;
