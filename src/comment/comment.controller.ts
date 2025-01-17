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
  UserId,
  Inject,
  UploadedFiles,
  AuthOnly, UserConnections, UserConnectionsType,
} from 'light-kite';
import {IComment} from './comment.schema';
import CommentService from './comment.service';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import TYPES from '../types';
import Action from '../notification/enums/action.enum';
import EntityType from '../notification/enums/entity-type.enum';
import mongoose from 'mongoose';
import NotificationService from '../notification/notification.service';
import {IPost} from '../post/post.schema';

@Controller('/comments')
class CommentController {
  constructor(
    @Inject(TYPES.CommentService) private readonly commentService: CommentService,
    @Inject(TYPES.NotificationService) private readonly notificationService: NotificationService,
  ) {
  }

  @AuthOnly()
  @Get(':id')
  getById(@Param('id') id: string): Promise<IComment | null> {
    return this.commentService.findById(id);
  }

  @AuthOnly()
  @ValidateDto(CreateCommentDto)
  @StatusCode(201)
  @Post()
  async create(
    @UserConnections() userConnections: UserConnectionsType,
    @UserId() userId: string,
    @Body() data: CreateCommentDto,
  ): Promise<IComment> {
    const comment = await this.commentService.create(userId, data);

    // TODO: move to the service and create reusable function
    await this.notificationService.create({
      action: Action.COMMENT,
      entityType: EntityType.POST,
      entityId: comment.post._id,
      mediaId: (comment.post as IPost).mediaId,
      sender: new mongoose.Types.ObjectId(userId),
      receiver: (comment.post as IPost).author._id,
    }, userConnections);

    return comment;
  }

  @AuthOnly()
  @ValidateDto(UpdateCommentDto)
  @StatusCode(201)
  @Put(':id')
  update(@Param('id') postId: string, @UserId() userId: string, @Body() data: UpdateCommentDto): Promise<IComment> {
    return this.commentService.update(userId, postId, data);
  }

  @AuthOnly()
  @Delete(':id')
  async delete(
    @UserConnections() userConnections: UserConnectionsType,
    @Param('id') postId: string,
    @UserId() userId: string,
  ): Promise<IComment> {
    const comment = await this.commentService.delete(userId, postId);

    await this.notificationService.deleteByParams({
      action: Action.COMMENT,
      entityType: EntityType.POST,
      entityId: (comment.post as IPost)._id,
      sender: userId,
    }, userConnections);

    return comment;
  }

  @AuthOnly()
  @Post(':id/toggle-like')
  async toggleLike(
    @UserConnections() userConnections: UserConnectionsType,
    @Param('id') postId: string,
    @UserId() userId: string,
  ): Promise<IComment> {
    const comment = await this.commentService.toggleLike(userId, postId);

    // TODO: move to the service and create reusable function
    if (!comment.author._id.equals(userId)) {
      if (comment.likedBy.find((id) => id.equals(userId))) {
        await this.notificationService.create({
          action: Action.LIKE,
          entityType: EntityType.COMMENT,
          entityId: comment._id,
          mediaId: (comment.post as IPost).mediaId,
          sender: new mongoose.Types.ObjectId(userId),
          receiver: comment.author._id,
        }, userConnections);
      } else {
        await this.notificationService.deleteByParams({
          action: Action.LIKE,
          entityType: EntityType.COMMENT,
          entityId: comment._id,
          sender: userId,
        }, userConnections);
      }
    }

    return comment;
  }
}

export default CommentController;