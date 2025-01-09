import multer from 'multer';
import morgan from 'morgan';
import UserController from './user/user.controller';
import MessageController from './message/message.controller';
import ConversationController from './conversation/conversation.controller';
import NotificationController from './notification/notification.controller';
import UserService from './user/user.service';
import NotificationService from './notification/notification.service';
import MessageService from './message/message.service';
import MessageEventService from './message/message-event.service';
import MediaService from './core/services/media.service';
import PostService from './post/post.service';
import ConversationService from './conversation/conversation.service';
import ConversationEventService from './conversation/conversation-event.service';
import FileLogger from './core/logger/file-logger';
import TYPES from './types';
import PostController from './post/post.controller';
import CommentController from './comment/comment.controller';
import CommentService from './comment/comment.service';
import NotificationEventService from './notification/notification-event.service';

export default {
  middlewares: [
    multer().any(),
    morgan('dev'),
  ],
  controllers: [
    UserController,
    PostController,
    CommentController,
    MessageController,
    ConversationController,
    NotificationController,
  ],
  services: [
    UserService,
    PostService,
    CommentService,
    NotificationService,
    NotificationEventService,
    MessageService,
    MessageEventService,
    MediaService,
    ConversationService,
    ConversationEventService,
    { Service: FileLogger, TypeSymbol: TYPES.ILogger }
  ],
}