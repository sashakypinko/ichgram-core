import SocketEventService from '../core/socket-event-service';
import {IConversation} from './conversation.schema';
import {Injectable, UserConnectionsType} from 'light-kite';

@Injectable()
class ConversationEventService extends SocketEventService<IConversation> {
  constructor() {
    super('conversation');
  }

  created(userConnections: UserConnectionsType, userId: string, conversation: IConversation) {
    this.emitByType('created', userConnections, userId, conversation);
  }
  
  deleted(userConnections: UserConnectionsType, userId: string, conversation: IConversation) {
    this.emitByType('deleted', userConnections, userId, conversation);
  }

  private async emitByType(type: string, userConnections: UserConnectionsType, authUserId: string, conversation: IConversation): Promise<void> {
    for (const {userId} of conversation.participants) {
      if (userId.equals(authUserId)) continue;
      this.emit(type, userConnections.get(userId.toString()), conversation);
    }
  }
}
 
export default ConversationEventService;