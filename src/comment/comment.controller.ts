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
  AuthOnly,
} from 'light-kite';
import { IComment } from './comment.schema';
import CommentService from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import TYPES from '../types';

@Controller('/comments')
class CommentController {
  constructor(@Inject(TYPES.CommentService) private readonly commentService: CommentService) {}

  @AuthOnly()
  @Get(':id')
  getById(@Param('id') id: string): Promise<IComment | null> {
    return this.commentService.findById(id);
  }
  
  @AuthOnly()
  @ValidateDto(CreateCommentDto)
  @StatusCode(201)
  @Post()
  create(@UserId() userId: string, @Body() data: CreateCommentDto): Promise<IComment> {
    return this.commentService.create(userId, data);
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
  async delete(@Param('id') postId: string, @UserId() userId: string): Promise<IComment> {
    return this.commentService.delete(userId, postId);
  }
  
  @AuthOnly()
  @Post(':id/toggle-like')
  toggleLike(@Param('id') postId: string, @UserId() userId: string): Promise<IComment> {
    return this.commentService.toggleLike(userId, postId);
  }
}

export default CommentController;