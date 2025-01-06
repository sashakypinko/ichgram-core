import {CreateUserDto} from './dto/create-user.dto';
import {IUser, User} from './user.schema';
import {UpdateUserDto} from './dto/update-user.dto';
import {BadRequestException, Inject, Injectable} from 'light-kite';
import ILogger from '../core/logger/logger.interface';
import TYPES from '../types';
import {UniqueFields} from './types';
import roleScopes from '../core/enums/role-scopes';
import Role from '../core/enums/roles';
import EntityService from '../core/services/entity.service';

@Injectable()
class UserService extends EntityService<IUser> {
  constructor(@Inject(TYPES.ILogger) private readonly logger: ILogger) {
    super(User);
  }
  
  async getByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
  
  async getByUniqueFields(query: UniqueFields): Promise<IUser | null> {
    const user = await User.findOne(
      { $or: Object.entries(query).map(([key, value]) => ({ [key]: value })) }
    );

    return user ? this.withCounts(user) : null;
  }

  async getFollowersById(id: string, offset: number = 0, limit: number = 20): Promise<IUser[]> {
    const user = await this.getById(id);
    return User.find({ followings: user._id }).skip(offset).limit(limit);
  }

  async getFollowingsById(id: string, offset: number = 0, limit: number = 20): Promise<IUser[]> {
    const user = await this.getById(id);
    return User.find({ _id: { $in: user.followings } }).skip(offset).limit(limit);
  }
  
  async create(data: CreateUserDto): Promise<IUser> {
    const existingUser: IUser | null = await User.findOne({ email: data.email });
    if (existingUser) throw new BadRequestException('User with this email already exists');

    const user = new User({
      ...data,
      role: Role.User,
      scopes: roleScopes[Role.User],
    });
    await user.save();
    this.logger.logInfo(`User with ID: ${user._id} has been created.`);
    return user;
  }
  
  async update(id: string, data: UpdateUserDto): Promise<IUser> {
    const user = await this.getById(id);

    Object.assign(user, data);
    await user.save();
    return user;
  }

  async delete(id: string): Promise<IUser | null> {
    const user = this.getById(id);

    await User.deleteOne({ _id: id });
    this.logger.logInfo(`User with ID: ${id} has been deleted.`);
    return user;
  }

  async search(userId: string, search: string): Promise<IUser[]> {
    if (!search) {
      return [];
    }

    return User.find({
      _id: { $ne: userId },
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ]
    })
      .limit(10);
  }

  async follow(followedId: string, followerId: string): Promise<IUser> {
    const user = await this.getById(followerId);
    const followed = await this.getById(followedId);
    
    if (followedId === followerId) {
      throw new BadRequestException('You can\'t follow yourself');
    }
    
    if (user.followings.find((id) => id.equals(followedId))) {
      throw new BadRequestException('You are already following this user');
    }

    user.followings.push(followed._id);
    await user.save();
    
    return this.withCounts(followed);
  }

  async unfollow(followedId: string, followerId: string): Promise<IUser> {
    const user = await this.getById(followerId);
    const followed = await this.getById(followedId);

    if (followedId === followerId) {
      throw new BadRequestException('You can\'t unfollow yourself');
    }
    
    if (!user.followings.find((id) => id.equals(followedId))) {
      throw new BadRequestException('You are not following this user');
    }

    user.followings = user.followings.filter((id) => !id.equals(followedId));
    await user.save();

    return this.withCounts(followed);
  }
  
  private async withCounts(user: IUser): Promise<IUser> {
    user.followersCount = await User.countDocuments({ followings: user._id });
    return user;
  }
}

export default UserService;