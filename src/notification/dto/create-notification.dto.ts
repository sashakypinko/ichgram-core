import Action from '../enums/action.enum';
import mongoose from 'mongoose';

export class CreateNotificationDto {
  action: Action;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  mediaId?: string;
}