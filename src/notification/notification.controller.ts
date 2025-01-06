import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  StatusCode,
  Body, UserId, Inject,
} from 'light-kite';
import NotificationService from './notification.service';
import { INotification } from './notification.schema';
import {CreateNotificationDto} from './dto/create-notification.dto';
import TYPES from '../types';

@Controller('/notifications')
class NotificationController {
  constructor(@Inject(TYPES.NotificationService) private readonly notificationService: NotificationService) {}

  @Get(':id')
  async getAll(@UserId() userId: string): Promise<INotification[]> {
    return this.notificationService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<INotification | null> {
    return this.notificationService.getById(id);
  }

  @StatusCode(201)
  @Post()
  store(@Body() data: CreateNotificationDto): Promise<INotification> {
    return this.notificationService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<INotification | null> {
    return this.notificationService.delete(id);
  }
}

export default NotificationController;
