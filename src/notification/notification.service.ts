import {INotification, Notification} from './notification.schema';
import {BadRequestException, Inject, Injectable, UserConnectionsType} from 'light-kite';
import {CreateNotificationDto} from './dto/create-notification.dto';
import EntityService from '../core/services/entity.service';
import NotificationEventService from './notification-event.service';
import TYPES from '../types';

@Injectable()
class NotificationService extends EntityService<INotification> {
  constructor(@Inject(TYPES.NotificationEventService) private readonly notificationEventService: NotificationEventService) {
    super(Notification);
  }
  
  async getByUserId(userId: string, offset: number = 0, limit: number = 20): Promise<INotification[]> {
    return this.model.find({ receiver: userId })
      .sort({ createdAt: -1 });
  }

  async create(data: CreateNotificationDto, userConnections: UserConnectionsType): Promise<INotification> {
    const notification = new this.model({
      ...data,
      
    });
    await notification.save();
    
    this.notificationEventService.created(userConnections, notification);
    
    return notification;
  }

  async delete(id: string, userConnections: UserConnectionsType): Promise<INotification | null> {
    const notification: INotification | null = await this.model.findById(id);
    if (!notification) throw new BadRequestException('Notification not found');

    await this.model.deleteOne({ _id: id });

    this.notificationEventService.deleted(userConnections, notification);
    
    return notification;
  }
}

export default NotificationService;