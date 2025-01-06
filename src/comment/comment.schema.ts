import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  text: string;
  likedBy: Types.ObjectId[];
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CommentSchema.pre(/^find/ as unknown as 'find', function(next) {
  this.populate('author post');
  next();
});

export const Comment = model('Comment', CommentSchema);  