import mongoose, { Schema, model, Document } from 'mongoose';
import {IUser} from '../user/user.schema';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  mediaId?: string;
  sentAt: Date;
  readBy: mongoose.Types.ObjectId[];
  edited: boolean;
  repliedTo?: mongoose.Types.ObjectId;
  forwardedFrom?: mongoose.Types.ObjectId;
  sender?: IUser;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  mediaId: { type: String },
  sentAt: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  edited: { type: Boolean, default: false },
  repliedTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  forwardedFrom: { type: Schema.Types.ObjectId, ref: 'User' }
});

MessageSchema.set('toJSON', { virtuals: true });

MessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

MessageSchema.virtual('repliedMessage', {
  ref: 'Message',
  localField: 'repliedTo',
  foreignField: '_id',
  justOne: true
});

MessageSchema.virtual('forwardedMessage', {
  ref: 'Message',
  localField: 'forwardedFrom',
  foreignField: '_id',
  justOne: true
});

export const Message = model('Message', MessageSchema);
