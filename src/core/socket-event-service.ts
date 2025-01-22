import {Socket} from 'socket.io';
import {UserConnectionsType} from 'light-kite';

class SocketEventService<T> {
  constructor(
    private readonly eventDomain: string,
  ) {}

  handleEvents(userConnections: UserConnectionsType, socket: Socket){}

  protected emit(eventType: string, socket: Socket | undefined, payload: T): void {
    if (socket?.connected) {
      socket.emit(`${this.eventDomain}:${eventType}`, payload);
    }
  }
}

export default SocketEventService;