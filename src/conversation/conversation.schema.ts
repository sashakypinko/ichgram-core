import mongoose, { Schema, model, Document } from 'mongoose';
import {ConversationParticipantRole, ConversationType} from './enums/conversation.enum';
import {IUser} from '../user/user.schema';
import {IMessage} from '../message/message.schema';

export type Participant = {
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  role: ConversationParticipantRole;
  user?: IUser;
};

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  type: ConversationType;
  title?: string;
  participants: Participant[];
  createdAt: Date;
  lastMessage?: IMessage;
}

const ConversationSchema = new Schema<IConversation>({
  type: { type: String, enum: ConversationType, default: ConversationType.PRIVATE },
  title: String,
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      joinedAt: { type: Date, default: Date.now },
      role: { type: String, enum: ConversationParticipantRole, default: ConversationParticipantRole.MEMBER }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

ConversationSchema.virtual('participants.user', {
  ref: 'User',
  localField: 'participants.userId',
  foreignField: '_id',
  justOne: true
});

ConversationSchema.set('toJSON', { virtuals: true });
ConversationSchema.set('toObject', { virtuals: true });

export const Conversation = model('Conversation', ConversationSchema);
