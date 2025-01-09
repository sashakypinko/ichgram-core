import {
  Body,
  Controller,
  Post,
  ValidateDto,
  StatusCode,
  Get,
  Param,
  Put,
  Delete,
  Query,
  RequireScopes,
  UserId,
  Inject, AuthOnly, UserConnections, UserConnectionsType,
} from 'light-kite';
import {IUser} from './user.schema';
import UserService from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import TYPES from '../types';
import Scope from '../core/enums/scopes';
import {UniqueFields} from './types';
import {GetFollowersDto} from './dto/get-followers.dto';
import {GetFollowingsDto} from './dto/get-followings.dto';
import {PaginatedRequestDto} from './dto/paginated-request.dto';
import PostService from '../post/post.service';
import {IPost} from '../post/post.schema';
import Action from '../notification/enums/action.enum';
import EntityType from '../notification/enums/entity-type.enum';
import mongoose from 'mongoose';
import NotificationService from '../notification/notification.service';


@Controller('/users')
class UserController {
  constructor(
    @Inject(TYPES.UserService) private readonly userService: UserService,
    @Inject(TYPES.PostService) private readonly postService: PostService,
    @Inject(TYPES.NotificationService) private readonly notificationService: NotificationService,
  ) {
  }

  @RequireScopes([Scope.UserRead])
  @Get()
  getAll(): Promise<IUser[]> {
    return this.userService.getAll();
  }

  @RequireScopes([Scope.UserRead])
  @Get('search')
  search(@UserId() userId: string, @Query('search') search: string = ''): Promise<IUser[]> {
    return this.userService.search(userId, search);
  }

  @RequireScopes([Scope.UserRead])
  @Get('by-email')
  getByEmail(@Query('email') email: string): Promise<IUser | null> {
    return this.userService.getByEmail(email);
  }

  @RequireScopes([Scope.UserRead])
  @Get('by-unique-fields')
  getByUniqueFields(@Query() query: UniqueFields): Promise<IUser | null> {
    return this.userService.getByUniqueFields(query);
  }

  @RequireScopes([Scope.UserRead])
  @Get(':id')
  getById(@Param('id') id: string): Promise<IUser | null> {
    return this.userService.findById(id);
  }

  @ValidateDto(GetFollowersDto)
  @RequireScopes([Scope.UserRead])
  @Get(':id/followers')
  geFollowers(@Param('id') id: string, @Query() {offset, limit}: GetFollowersDto): Promise<IUser[]> {
    return this.userService.getFollowersById(id, offset, limit);
  }

  @ValidateDto(GetFollowingsDto)
  @RequireScopes([Scope.UserRead])
  @Get(':id/followings')
  getFollowings(@Param('id') id: string, @Query() {offset, limit}: GetFollowingsDto): Promise<IUser[]> {
    return this.userService.getFollowingsById(id, offset, limit);
  }

  @AuthOnly()
  @Get(':id/posts')
  getPosts(@Param('id') id: string, @Query() {offset, limit}: PaginatedRequestDto): Promise<IPost[]> {
    return this.postService.getByUserIds([id], offset, limit);
  }

  @RequireScopes([Scope.UserManage])
  @ValidateDto(CreateUserDto)
  @StatusCode(201)
  @Post()
  create(@Body() data: CreateUserDto): Promise<IUser> {
    return this.userService.create(data);
  }

  @RequireScopes([Scope.UserManage])
  @ValidateDto(UpdateUserDto)
  @StatusCode(201)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<IUser> {
    return this.userService.update(id, data);
  }

  @RequireScopes([Scope.UserManage])
  @Post(':id/follow')
  async follow(
    @UserConnections() userConnections: UserConnectionsType,
    @Param('id') id: string,
    @UserId() authUserId: string,
  ): Promise<IUser> {
    const user = await this.userService.follow(id, authUserId);
    const authUser = await this.userService.getById(authUserId);

    await this.notificationService.create({
      action: Action.FOLLOW,
      entityType: EntityType.USER,
      entityId: authUser._id,
      sender: authUser._id,
      receiver: user._id,
    }, userConnections);

    return user;
  }

  @RequireScopes([Scope.UserManage])
  @Post(':id/unfollow')
  async unfollow(
    @UserConnections() userConnections: UserConnectionsType,
    @Param('id') id: string,
    @UserId() authUserId: string,
  ): Promise<IUser> {
    const user = await this.userService.unfollow(id, authUserId);
    const authUser = await this.userService.getById(authUserId);
    
    await this.notificationService.deleteByParams({
      action: Action.FOLLOW,
      entityType: EntityType.USER,
      sender: authUser._id,
      receiver: user._id,
    }, userConnections);
    
    return user;
  }

  @RequireScopes([Scope.UserManage])
  @Delete(':id')
  delete(@Param('id') id: string): Promise<IUser | null> {
    return this.userService.delete(id);
  }
}

export default UserController;