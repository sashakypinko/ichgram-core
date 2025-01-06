import mongoose, { Schema, model, Document } from 'mongoose';
import Action from './enums/action.enum';

export interface INotification extends Document {
  action: Action;
  content: string;
  viewed: boolean;
  entityId: string;
  mediaId: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  action: { type: String, enum: Action, required: true },
  content: { type: String, default: '' },
  viewed: { type: Boolean, default: false },
  entityId: { type: String },
  mediaId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model('Notification', NotificationSchema);
