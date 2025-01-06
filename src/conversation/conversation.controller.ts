import {
  AuthOnly,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post, Put,
  RequireScopes,
  StatusCode,
  UserConnections,
  UserConnectionsType,
  UserId,
  ValidateDto,
} from 'light-kite';
import ConversationService from './conversation.service';
import ConversationEventService from './conversation-event.service';
import {CreateConversationDto} from './dto/create-conversation.dto';
import {IConversation} from './conversation.schema';
import TYPES from '../types';
import Scope from '../core/enums/scopes';

@Controller('/conversations')
class ConversationController {
  constructor(
    @Inject(TYPES.ConversationService) private readonly conversationService: ConversationService,
    @Inject(TYPES.ConversationEventService) private readonly conversationEventService: ConversationEventService,
  ) {}

  @AuthOnly()
  @Get()
  async get(@UserId() userId: string): Promise<IConversation[]> {
    return this.conversationService.get(userId);
  }

  @ValidateDto(CreateConversationDto)
  @RequireScopes([Scope.MessageSend])
  @StatusCode(201)
  @Post()
  async create(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @Body() data: CreateConversationDto,
  ): Promise<IConversation> {
    const conversation = await this.conversationService.create(userId, data);
    this.conversationEventService.created(userConnections, userId, conversation);
    return conversation;
  }

  @RequireScopes([Scope.MessageManage])
  @Post(':id/leave')
  async leave(
    @UserId() userId: string,
    @Param('id') conversationId: string,
  ): Promise<IConversation> {
    return this.conversationService.removeParticipant(conversationId, userId);
  }

  @RequireScopes([Scope.MessageSend])
  @Delete(':id')
  async delete(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string, 
    @Param('id') conversationId: string,
  ): Promise<IConversation> {
    const conversation = await this.conversationService.delete(conversationId, userId);
    this.conversationEventService.deleted(userConnections, userId, conversation);
    return conversation;
  }
}

export default ConversationController;