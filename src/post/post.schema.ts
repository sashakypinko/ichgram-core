import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  mediaId: string;
  content: string;
  likedBy: Types.ObjectId[];
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  mediaId: { type: String, required: true },
  content: { type: String, required: true },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PostSchema.pre(/^find/ as unknown as 'find', function(next) {
  this.populate('author');
  next();
});

export const Post = model('Post', PostSchema);  