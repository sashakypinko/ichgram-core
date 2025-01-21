import {Socket} from 'socket.io';
import {IMessage} from './message.schema';
import SocketEventService from '../core/socket-event-service';
import ConversationEventService from '../conversation/conversation-event.service';
import ConversationService from '../conversation/conversation.service';
import UserService from '../user/user.service';
import {Inject, Injectable, UserConnectionsType} from 'light-kite';
import TYPES from '../types';

@Injectable()
class MessageEventService extends SocketEventService<IMessage> {
  constructor(
    @Inject(TYPES.ConversationService) private readonly conversationService: ConversationService,
    @Inject(TYPES.ConversationEventService) private readonly conversationEventService: ConversationEventService,
    @Inject(TYPES.UserService) private readonly userService: UserService,
  ) {
    super('message');
  }

  sent(userConnections: UserConnectionsType, authUserId: string, message: IMessage): void {
    this.emitByType('sent', userConnections, authUserId, message);
  }

  updated(userConnections: UserConnectionsType, authUserId: string, message: IMessage): void {
    this.emitByType('updated', userConnections, authUserId, message);
  }

  deleted(userConnections: UserConnectionsType, authUserId: string, message: IMessage): void {
    this.emitByType('deleted', userConnections, authUserId, message);
  }
  
  handleEvents(userConnections: UserConnectionsType,  socket: Socket) {
    socket.on('message:typing', async (conversationId: string) => {
      const user = await this.userService.findById(socket.data.auth.userId);
      const conversation = await this.conversationService.findById(conversationId);
      
      if (user && conversation) {
        this.conversationEventService.typing(userConnections, user, conversation)
      }
    });
  }

  private async emitByType(type: string, userConnections: UserConnectionsType, authUserId: string, message: IMessage): Promise<void> {
    const conversation = await this.conversationService.findById(message.conversationId.toString());
    
    if (!conversation) return;

    for (const {userId} of conversation.participants) {
      if (userId.equals(authUserId)) continue;
      this.emit(type, userConnections.get(userId.toString()), message);
    }
  }
}

export default MessageEventService;