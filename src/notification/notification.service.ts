import {INotification, Notification} from './notification.schema';
import {BadRequestException, Injectable} from 'light-kite';
import {CreateNotificationDto} from './dto/create-notification.dto';
import EntityService from '../core/services/entity.service';

@Injectable()
class NotificationService extends EntityService<INotification> {
  constructor() {
    super(Notification);
  }

  async create(data: CreateNotificationDto): Promise<INotification> {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  }

  async delete(id: string): Promise<INotification | null> {
    const notification: INotification | null = await Notification.findById(id);
    if (!notification) throw new BadRequestException('Notification not found');

    await Notification.deleteOne({ _id: id });
    return notification;
  }
}

export default NotificationService;