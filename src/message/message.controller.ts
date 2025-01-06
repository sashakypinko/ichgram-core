import {
  AuthOnly,
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  Post,
  Put,
  Query,
  RequireScopes,
  StatusCode,
  UploadedFiles,
  UserConnections,
  UserConnectionsType,
  UserId,
  ValidateDto,
} from 'light-kite';
import MessageService from './message.service';
import {IMessage} from './message.schema';
import {GetMessagesDto} from './dto/get-messages.dto';
import {SendMessageDto} from './dto/send-message.dto';
import {UpdateMessageDto} from './dto/update-message.dto';
import MessageEventService from './message-event.service';
import MediaService from '../core/services/media.service';
import TYPES from '../types';
import Scope from '../core/enums/scopes';

@Controller('/messages')
class MessageController {
  constructor(
    @Inject(TYPES.MessageService) private readonly messageService: MessageService,
    @Inject(TYPES.MessageEventService) private readonly messageEventService: MessageEventService,
    @Inject(TYPES.MediaService) private readonly mediaService: MediaService,
  ) {
  }

  @ValidateDto(GetMessagesDto)
  @AuthOnly()
  @Get()
  getMessages(@UserId() userId: string, @Query() {conversationId, offset = 0}: GetMessagesDto): Promise<IMessage[]> {
    return this.messageService.getByConversationId(userId, conversationId, offset);
  }

  @ValidateDto(SendMessageDto)
  @RequireScopes([Scope.MessageSend])
  @StatusCode(201)
  @Post('send')
  async send(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @UploadedFiles('media') file: Express.Multer.File,
    @Body() data: SendMessageDto & { mediaId: string },
  ): Promise<IMessage> {
    if (file) {
      const media = await this.mediaService.store(file);
      data.mediaId = media._id;
    }
    const message = await this.messageService.send(userId, data);
    this.messageEventService.sent(userConnections, userId, message);
    return message;
  }

  @ValidateDto(UpdateMessageDto)
  @RequireScopes([Scope.MessageSend])
  @Put(':id')
  async update(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @Param('id') messageId: string,
    @Body() data: UpdateMessageDto,
  ): Promise<IMessage> {
    const message = await this.messageService.update(userId, messageId, data);
    this.messageEventService.updated(userConnections, userId, message);
    return message;
  }

  @RequireScopes([Scope.MessageSend])
  @Delete(':id')
  async delete(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @Param('id') messageId: string,
  ): Promise<IMessage> {
    const message = await this.messageService.delete(userId, messageId);

    if (message.mediaId) {
      await this.mediaService.remove(message.mediaId);
    }

    this.messageEventService.deleted(userConnections, userId, message);
    return message;
  }

  @RequireScopes([Scope.MessageSend])
  @Post(':id/mark-as-read')
  async markAsRead(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @Param('id') messageId: string,
  ): Promise<IMessage> {
    const message = await this.messageService.markAsRead(userId, messageId);
    this.messageEventService.updated(userConnections, userId, message);
    return message;
  }
}

export default MessageController;