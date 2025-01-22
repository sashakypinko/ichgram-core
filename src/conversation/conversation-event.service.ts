import SocketEventService from '../core/socket-event-service';
import {IConversation} from './conversation.schema';
import {Injectable, UserConnectionsType} from 'light-kite';
import {IUser} from '../user/user.schema';

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

  typing(userConnections: UserConnectionsType, user: IUser, conversation: IConversation) {
    this.emitByType('typing', userConnections, user._id.toString(), conversation, {
      user,
      conversationId: conversation._id,
    });
  }

  private async emitByType(
    type: string,
    userConnections: UserConnectionsType,
    authUserId: string,
    conversation: IConversation,
    payload?: any,
  ): Promise<void> {
    for (const {userId} of conversation.participants) {
      if (userId.equals(authUserId)) continue;
      this.emit(type, userConnections.get(userId.toString()), payload || conversation);
    }
  }
}

export default ConversationEventService;