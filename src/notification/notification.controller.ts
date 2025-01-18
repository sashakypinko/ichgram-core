import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  StatusCode,
  Body,
  UserId,
  Inject,
  UserConnections,
  UserConnectionsType, AuthOnly, Query,
} from 'light-kite';
import NotificationService from './notification.service';
import {INotification} from './notification.schema';
import {CreateNotificationDto} from './dto/create-notification.dto';
import TYPES from '../types';
import {PaginatedRequestDto} from '../user/dto/paginated-request.dto';

@Controller('/notifications')
class NotificationController {
  constructor(@Inject(TYPES.NotificationService) private readonly notificationService: NotificationService) {
  }

  @AuthOnly()
  @Get('')
  getAll(@UserId() userId: string, @Query() {offset, limit}: PaginatedRequestDto): Promise<INotification[]> {
    return this.notificationService.getByUserId(userId, offset, limit);
  }

  @AuthOnly()
  @Get(':id')
  getById(@Param('id') id: string): Promise<INotification | null> {
    return this.notificationService.getById(id);
  }

  @AuthOnly()
  @StatusCode(201)
  @Post()
  store(@Body() data: CreateNotificationDto, @UserConnections() userConnections: UserConnectionsType): Promise<INotification> {
    return this.notificationService.create(data, userConnections);
  }

  @AuthOnly()
  @Post('mark-all-viewed')
  async markAllViewed(@UserId() userId: string): Promise<INotification[]> {
    return this.notificationService.markAllAsViewed(userId);
  }
}

export default NotificationController;
