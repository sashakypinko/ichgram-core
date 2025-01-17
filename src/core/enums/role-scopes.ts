import Role from './roles';
import Scope from './scopes';

const roleScopes: Record<Role, Scope[]> = {
  [Role.Admin]: [
    Scope.UserRead,
    Scope.UserManage,
    Scope.ContentRead,
    Scope.ContentWrite,
    Scope.ContentManage,
    Scope.CommentRead,
    Scope.CommentWrite,
    Scope.CommentManage,
    Scope.MediaLoad,
    Scope.MediaUpload,
    Scope.MediaManage,
    Scope.NotificationsManage,
    Scope.MessageSend,
    Scope.MessageManage,
  ],
  [Role.User]: [
    Scope.UserRead,
    Scope.UserManage,
    Scope.ContentRead,
    Scope.ContentWrite,
    Scope.CommentRead,
    Scope.CommentWrite,
    Scope.MediaLoad,
    Scope.NotificationsManage,
    Scope.MessageSend,
  ],
};

export default roleScopes;