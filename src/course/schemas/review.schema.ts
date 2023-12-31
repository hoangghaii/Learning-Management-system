import { User } from '@/auth/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

import { CommentItem, CommentItemSchema } from './comment-item.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Review extends Document {
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
    default: 0,
    type: Number,
  })
  rating: number;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  user: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
