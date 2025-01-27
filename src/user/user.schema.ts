import { Schema, model, Document, Types } from 'mongoose';
import Role from '../core/enums/roles';
import Scope from '../core/enums/scopes';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string | null;
  role: Role;
  scopes: Scope[];
  avatar: string;
  website: string;
  about: string;
  followings: Types.ObjectId[];
  followersCount?: number;
  postsCount?: number;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  role: { type: String, required: true, enum: Object.values(Role) },
  scopes: { type: [String], enum: Object.values(Scope), required: true },
  avatar: { type: String, default: null },
  website: { type: String, default: '' },
  about: { type: String, default: '' },
  followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  toJSON: { virtuals: true },
});

UserSchema.virtual('followersCount');
UserSchema.virtual('postsCount');

export const User = model('User', UserSchema);