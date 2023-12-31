import { User } from '@/auth/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

import { CommentItem, CommentItemSchema } from './comment-item.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Comment extends Document {
  @Prop({
    required: [true, 'Please enter your comment'],
    type: String,
  })
  comment: string;

  @Prop({
    type: [CommentItemSchema],
  })
  commentReplies: CommentItem[];

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
