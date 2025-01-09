import mongoose, { Types } from 'mongoose';
import { IPost, Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BadRequestException, ForbiddenException, Injectable } from 'light-kite';
import EntityService from '../core/services/entity.service';

@Injectable()
class PostService extends EntityService<IPost> {
  constructor() {
    super(Post);
  }

  async getByUserIds(userIds: (Types.ObjectId | string)[], offset: number = 0, limit: number = 20): Promise<IPost[]> {
    return this.model.find({ author: { $in: userIds } })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  }

  async getTrendingPosts(offset: string | number = 0, limit: string | number = 20): Promise<IPost[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $project: {
          mediaId: 1,
          content: 1,
          author: { $arrayElemAt: ['$author', 0] },
          createdAt: 1,
          likedBy: 1,
          likesCount: { $size: '$likedBy' },
        },
      },
      { $sort: { likesCount: -1 } },
      { $skip: typeof offset === 'string' ? parseInt(offset) : offset },
      { $limit: typeof limit === 'string' ? parseInt(limit) : limit },
    ]);
  }

  async create(userId: string, data: CreatePostDto): Promise<IPost> {
    const post = new this.model({ ...data, author: userId });

    await post.save();
    return post.populate('author');
  }

  async update(userId: string, postId: string, data: UpdatePostDto): Promise<IPost> {
    const post = await this.getById(postId);

    if (!post.author.equals(userId)) {
      throw new ForbiddenException('User is not authorized to update this post');
    }

    Object.assign(post, data);

    await post.save();
    return post;
  }

  async delete(userId: string, postId: string): Promise<IPost> {
    const post = await this.getById(postId);

    if (!post.author.equals(userId)) {
      throw new ForbiddenException('User is not authorized to delete this post');
    }

    await this.model.deleteOne({ _id: postId });
    return post;
  }

  async toggleLike(userId: string, postId: string): Promise<IPost> {
    const post = await this.getById(postId);
    const existingLikeIndex = post.likedBy.findIndex((id) => id.equals(userId));

    if (existingLikeIndex === -1) {
      post.likedBy.push(new mongoose.Types.ObjectId(userId));
    } else {
      post.likedBy = [
        ...post.likedBy.slice(0, existingLikeIndex),
        ...post.likedBy.slice(existingLikeIndex + 1),
      ];
    }

    await post.save();
    return post;
  }
}

export default PostService;