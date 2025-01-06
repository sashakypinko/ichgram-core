import mongoose from 'mongoose';
import { ForbiddenException, Injectable } from 'light-kite';
import { IComment, Comment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import EntityService from '../core/services/entity.service';

@Injectable()
class CommentService extends EntityService<IComment> {
  constructor() {
    super(Comment);
  }
  
  getByPostId(postId: string, offset: number = 0, limit: number = 20): Promise<IComment[]> {
    return this.model.find({ post: postId }).skip(offset).limit(limit);
  }
  
  async create(userId: string, data: CreateCommentDto): Promise<IComment> {
    const post = new this.model({ ...data, author: userId });

    await post.save();
    return post.populate('author post');
  }

  async update(userId: string, commentId: string, data: UpdateCommentDto): Promise<IComment> {
    const comment = await this.getById(commentId);

    if (!comment.author.equals(userId)) {
      throw new ForbiddenException('User is not authorized to update this comment');
    }

    Object.assign(comment, data);

    await comment.save();
    return comment;
  }

  async delete(userId: string, commentId: string): Promise<IComment> {
    const comment = await this.getById(commentId);

    if (!comment.author.equals(userId)) {
      throw new ForbiddenException('User is not authorized to delete this comment');
    }

    await this.model.deleteOne({ _id: commentId });
    return comment;
  }

  async toggleLike(userId: string, commentId: string): Promise<IComment> {
    const comment = await this.getById(commentId);
    const existingLikeIndex = comment.likedBy.findIndex((id) => id.equals(userId));

    if (existingLikeIndex === -1) {
      comment.likedBy.push(new mongoose.Types.ObjectId(userId));
    } else {
      comment.likedBy = [
        ...comment.likedBy.slice(0, existingLikeIndex),
        ...comment.likedBy.slice(existingLikeIndex + 1),
      ];
    }

    await comment.save();
    return comment;
  }
}

export default CommentService;