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
  UserId,
  Inject, UploadedFiles, AuthOnly,
} from 'light-kite';
import { IPost } from './post.schema';
import PostService from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import MediaService from '../core/services/media.service';
import UserService from '../user/user.service';
import TYPES from '../types';
import { PaginatedRequestDto } from '../user/dto/paginated-request.dto';
import CommentService from '../comment/comment.service';
import { IComment } from '../comment/comment.schema';

@Controller('/posts')
class PostController {
  constructor(
    @Inject(TYPES.PostService) private readonly postService: PostService,
    @Inject(TYPES.MediaService) private readonly mediaService: MediaService,
    @Inject(TYPES.UserService) private readonly userService: UserService,
    @Inject(TYPES.CommentService) private readonly commentService: CommentService,
  ) {}
  
  @AuthOnly()
  @Get('by-following')
  async getByFollowing(@UserId() userId: string, @Query() { offset, limit }: PaginatedRequestDto): Promise<IPost[]> {
    const user = await this.userService.getById(userId);
    return this.postService.getByUserIds(user.followings, offset, limit);
  }
  
  @AuthOnly()
  @ValidateDto(PaginatedRequestDto)
  @Get('trending')
  async getTrending(@UserId() userId: string, @Query() { offset, limit }: PaginatedRequestDto): Promise<IPost[]> {
    return this.postService.getTrendingPosts(offset, limit);
  }

  @AuthOnly()
  @Get(':id')
  getById(@Param('id') id: string): Promise<IPost | null> {
    return this.postService.findById(id);
  }

  @AuthOnly()
  @Get(':id/comments')
  getComments(@Param('id') id: string, @Query() { offset, limit }: PaginatedRequestDto): Promise<IComment[]> {
    return this.commentService.getByPostId(id, offset, limit);
  }
  
  @AuthOnly()
  @ValidateDto(CreatePostDto)
  @StatusCode(201)
  @Post()
  async create(
    @UserId() userId: string,
    @UploadedFiles('media') file: Express.Multer.File,
    @Body() data: CreatePostDto & { mediaId: string },
  ): Promise<IPost> {
    if (file) {
      const media = await this.mediaService.store(file);
      data.mediaId = media._id;
    }

    return this.postService.create(userId, data);
  }
  
  @AuthOnly()
  @ValidateDto(UpdatePostDto)
  @StatusCode(201)
  @Put(':id')
  update(@Param('id') postId: string, @UserId() userId: string, @Body() data: UpdatePostDto): Promise<IPost> {
    return this.postService.update(userId, postId, data);
  }
  
  @AuthOnly()
  @Delete(':id')
  async delete(@Param('id') postId: string, @UserId() userId: string): Promise<IPost> {
    const post = await this.postService.delete(userId, postId);

    if (post.mediaId) {
      await this.mediaService.remove(post.mediaId);
    }
    
    return post;
  }
  
  @AuthOnly()
  @Post(':id/toggle-like')
  toggleLike(@Param('id') postId: string, @UserId() userId: string): Promise<IPost> {
    return this.postService.toggleLike(userId, postId);
  }
}

export default PostController;