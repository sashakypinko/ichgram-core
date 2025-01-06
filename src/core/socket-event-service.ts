import {Socket} from 'socket.io';

class SocketEventService<T> {
  constructor(
    private readonly eventDomain: string,
  ) {}

  protected emit(eventType: string, socket: Socket | undefined, payload: T): void {
    if (socket?.connected) {
      socket.emit(`${this.eventDomain}:${eventType}`, payload);
    }
  }
}

export default SocketEventService;