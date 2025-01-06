enum Scope {
  UserRead = 'user:read',
  UserManage = 'user:manage',
  ContentRead = 'content:read',
  ContentWrite = 'content:write',
  ContentManage = 'content:manage',
  CommentRead = 'comment:read',
  CommentWrite = 'comment:write',
  CommentManage = 'comment:manage',
  MediaLoad = 'media:load',
  MediaUpload = 'media:upload',
  MediaManage = 'media:manage',
  NotificationsManage = 'notifications:manage',
  MessageSend = 'message:send',
  MessageManage = 'message:manage',
}

export default Scope;