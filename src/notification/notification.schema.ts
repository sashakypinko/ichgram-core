import mongoose, { Schema, model, Document } from 'mongoose';
import Action from './enums/action.enum';

export interface INotification extends Document {
  action: Action;
  viewed: boolean;
  entityType: string;
  entityId: string;
  mediaId: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  action: { type: String, enum: Action, required: true },
  viewed: { type: Boolean, default: false },
  entityType: { type: String },
  entityId: { type: String },
  mediaId: { type: String },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.pre(/^find/ as unknown as 'find', function(next) {
  this.populate(['sender', 'receiver']);
  next();
});

export const Notification = model('Notification', NotificationSchema);
