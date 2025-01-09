import SocketEventService from '../core/socket-event-service';
import {Injectable, UserConnectionsType} from 'light-kite';
import {INotification} from './notification.schema';

@Injectable()
class NotificationEventService extends SocketEventService<INotification> {
  created(userConnections: UserConnectionsType, notification: INotification): void {
    this.emit('created', userConnections.get(notification.receiver.toString()), notification);
  }

  deleted(userConnections: UserConnectionsType, notification: INotification): void {
    this.emit('deleted', userConnections.get(notification.receiver.toString()), notification);
  }
}

export default NotificationEventService;