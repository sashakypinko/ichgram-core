const TYPES = {
  UserService: Symbol.for('UserService'),
  PostService: Symbol.for('PostService'),
  CommentService: Symbol.for('CommentService'),
  NotificationService: Symbol.for('NotificationService'),
  NotificationEventService: Symbol.for('NotificationEventService'),
  MessageService: Symbol.for('MessageService'),
  MessageEventService: Symbol.for('MessageEventService'),
  MediaService: Symbol.for('MediaService'),
  ConversationService: Symbol.for('ConversationService'),
  ConversationEventService: Symbol.for('ConversationEventService'),
  ILogger: Symbol.for('ILogger'),
};

export default TYPES;